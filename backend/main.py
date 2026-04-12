from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, chatbot, resume

app = FastAPI(title="Resume Master API")

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:4173",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
    "http://127.0.0.1:4173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(resume.router, prefix="/api", tags=["Resume Analysis"])
app.include_router(chatbot.router, prefix="/api", tags=["Chatbot"])


@app.get("/")
def read_root():
    return {"message": "Welcome to Resume Master API!"}
