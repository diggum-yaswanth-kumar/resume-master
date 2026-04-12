import json
from urllib import error, request

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from core.config import settings

router = APIRouter()

SYSTEM_PROMPT = (
    "You are Resume Master AI, a concise and helpful assistant for resume, job search, "
    "career preparation, interviews, ATS optimization, and this product's features. "
    "Give practical answers in plain language. If the question is unrelated, still be polite and helpful."
)


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    history: list[ChatMessage] = Field(default_factory=list)


class ChatResponse(BaseModel):
    reply: str


def _build_contents(history: list[ChatMessage], message: str) -> list[dict]:
    contents = []
    for item in history[-8:]:
        role = "model" if item.role == "assistant" else "user"
        contents.append({"role": role, "parts": [{"text": item.content}]})

    contents.append({"role": "user", "parts": [{"text": message}]})
    return contents


@router.post('/chatbot', response_model=ChatResponse)
async def chatbot(request_body: ChatRequest):
    if not settings.GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail='GEMINI_API_KEY is not configured on the server.')

    endpoint = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{settings.GEMINI_MODEL}:generateContent"
    )

    payload = {
        "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": _build_contents(request_body.history, request_body.message),
        "generationConfig": {
            "temperature": 0.7,
            "topP": 0.9,
            "maxOutputTokens": 600,
        },
    }

    req = request.Request(
        endpoint,
        data=json.dumps(payload).encode('utf-8'),
        headers={
            'Content-Type': 'application/json',
            'X-goog-api-key': settings.GEMINI_API_KEY,
        },
        method='POST',
    )

    try:
        with request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode('utf-8'))
    except error.HTTPError as exc:
        raw_detail = exc.read().decode('utf-8', errors='ignore')
        friendly_detail = raw_detail or 'Gemini request failed'

        try:
            parsed = json.loads(raw_detail)
            api_message = parsed.get('error', {}).get('message')
            if api_message:
                friendly_detail = api_message
        except json.JSONDecodeError:
            pass

        if exc.code == 429:
            friendly_detail = 'Gemini API quota is exceeded for the configured key. Add billing or use a different Gemini key.'

        raise HTTPException(status_code=exc.code, detail=friendly_detail)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f'Unable to reach Gemini API: {exc}')

    candidates = data.get('candidates') or []
    if not candidates:
        raise HTTPException(status_code=502, detail='Gemini returned no response candidates.')

    parts = candidates[0].get('content', {}).get('parts', [])
    reply = "\n".join(part.get('text', '').strip() for part in parts if part.get('text')).strip()
    if not reply:
        raise HTTPException(status_code=502, detail='Gemini returned an empty response.')

    return ChatResponse(reply=reply)
