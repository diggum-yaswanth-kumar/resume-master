from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class AnalysisResult(BaseModel):
    match_score: float
    missing_skills: List[str]
    extracted_skills: List[str]
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[str]

class ReportBase(BaseModel):
    user_id: str
    job_description: str
    resume_text: str
    analysis: AnalysisResult
    created_at: datetime = datetime.utcnow()

class ReportResponse(ReportBase):
    id: str
