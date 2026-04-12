import json
from urllib import error, request

from fastapi import APIRouter
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
    source: str = "fallback"


def _build_contents(history: list[ChatMessage], message: str) -> list[dict]:
    contents = []
    for item in history[-8:]:
        role = "model" if item.role == "assistant" else "user"
        contents.append({"role": role, "parts": [{"text": item.content}]})

    contents.append({"role": "user", "parts": [{"text": message}]})
    return contents


def _fallback_reply(message: str) -> str:
    text = message.lower()

    if any(word in text for word in ["ats", "keyword", "resume score", "screening"]):
        return (
            "To improve ATS performance, mirror the job description language exactly, keep a clear skills section, "
            "and include measurable achievements under each role. Focus first on matching tools, frameworks, and job-title keywords."
        )

    if any(word in text for word in ["resume", "cv", "fresher", "experience"]):
        return (
            "A strong resume should highlight your target role, top skills, projects, and measurable outcomes. "
            "For freshers, lead with projects, internships, certifications, and a short skills section tailored to the job description."
        )

    if any(word in text for word in ["interview", "hr round", "technical round"]):
        return (
            "For interview prep, study the company, review 3 to 5 projects or experiences you can explain clearly, "
            "and practice answering with situation, action, and result. Keep one short self-introduction ready too."
        )

    if any(word in text for word in ["job", "apply", "application", "career"]):
        return (
            "When applying for jobs, tailor your resume to each role, keep your LinkedIn aligned, and prioritize roles where you match at least half the required skills. "
            "A focused set of strong applications works better than many generic ones."
        )

    return (
        "I can help with resume improvement, ATS optimization, interview preparation, and job applications. "
        "Try asking about missing resume sections, ATS keywords, or how to tailor your resume for a role."
    )


def _gemini_reply(history: list[ChatMessage], message: str) -> str:
    endpoint = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{settings.GEMINI_MODEL}:generateContent"
    )

    payload = {
        "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": _build_contents(history, message),
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

    with request.urlopen(req, timeout=30) as response:
        data = json.loads(response.read().decode('utf-8'))

    candidates = data.get('candidates') or []
    if not candidates:
        raise ValueError('Gemini returned no response candidates.')

    parts = candidates[0].get('content', {}).get('parts', [])
    reply = "\n".join(part.get('text', '').strip() for part in parts if part.get('text')).strip()
    if not reply:
        raise ValueError('Gemini returned an empty response.')

    return reply


@router.post('/chatbot', response_model=ChatResponse)
async def chatbot(request_body: ChatRequest):
    if not settings.GEMINI_API_KEY:
        return ChatResponse(reply=_fallback_reply(request_body.message), source='fallback')

    try:
        reply = _gemini_reply(request_body.history, request_body.message)
        return ChatResponse(reply=reply, source='gemini')
    except error.HTTPError:
        return ChatResponse(
            reply=_fallback_reply(request_body.message) + "\n\nNote: The AI provider is unavailable right now, so this answer is from the built-in assistant.",
            source='fallback',
        )
    except Exception:
        return ChatResponse(
            reply=_fallback_reply(request_body.message) + "\n\nNote: The AI provider is unavailable right now, so this answer is from the built-in assistant.",
            source='fallback',
        )
