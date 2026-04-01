from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from motor.motor_asyncio import AsyncIOMotorDatabase
from database import get_database
from routes.auth import get_current_user
from models.resume import ReportResponse
from services.nlp import analyze_resume_vs_jd
import PyPDF2
import io
import uuid
from datetime import datetime

router = APIRouter()

@router.post("/analyze", response_model=ReportResponse)
async def analyze_resume(
    job_description: str = Form(...),
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    try:
        pdf_bytes = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
        resume_text = ""
        for page in pdf_reader.pages:
            resume_text += page.extract_text() or ""
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading PDF: {str(e)}")
        
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from the provided PDF.")

    analysis_result = analyze_resume_vs_jd(resume_text, job_description)
    
    report_id = str(uuid.uuid4())
    report_doc = {
        "id": report_id,
        "user_id": current_user["id"],
        "job_description": job_description,
        "resume_text": resume_text, # Or omit if privacy is a concern
        "analysis": analysis_result,
        "created_at": datetime.utcnow()
    }
    
    await db["reports"].insert_one(report_doc)
    
    return report_doc

@router.get("/history", response_model=list[ReportResponse])
async def get_history(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    cursor = db["reports"].find({"user_id": current_user["id"]}).sort("created_at", -1)
    reports = await cursor.to_list(length=100)
    return reports
