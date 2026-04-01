from typing import List, Dict
import re

def extract_skills_from_text(text: str) -> List[str]:
    # A simple regex mock/heuristic for skill extraction
    skills = set()
    # Mock hardcoded tech skills list for demo purposes
    tech_skills_db = {
        "python", "javascript", "react", "fastapi", "nodejs", "git", "aws", "docker", 
        "kubernetes", "sql", "nosql", "mongodb", "postgres", "html", "css", "tailwind",
        "api", "rest", "graphql", "machine learning", "nlp", "ai"
    }
    
    # Simple keyword extraction using regex to find word boundaries
    text_lower = text.lower()
    for skill in tech_skills_db:
        # if the skill is a standalone word or phrase in the text
        if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
            skills.add(skill)
            
    return list(skills)

def analyze_resume_vs_jd(resume_text: str, job_description: str) -> Dict:
    resume_skills = set(extract_skills_from_text(resume_text))
    jd_skills = set(extract_skills_from_text(job_description))

    if not jd_skills:
        return {
            "match_score": 100 if resume_skills else 0,
            "missing_skills": [],
            "extracted_skills": list(resume_skills),
            "strengths": ["Clear formatting"] if resume_text else [],
            "weaknesses": [],
            "suggestions": ["Job description didn't contain recognizable skills in our db. Provide a more detailed JD."]
        }
        
    match_count = len(resume_skills.intersection(jd_skills))
    match_score = round((match_count / len(jd_skills)) * 100, 2)
    missing_skills = list(jd_skills - resume_skills)
    
    strengths = []
    if match_score > 70:
        strengths.append("High correlation with job requirements")
    if len(resume_skills) > 5:
        strengths.append("Good variety of detected skills")

    weaknesses = []
    if missing_skills:
        weaknesses.append(f"Missing {len(missing_skills)} essential skills from the job description.")
        weaknesses.append(f"Critical missing keywords: {', '.join(missing_skills[:4])}")
    if match_score < 50:
        weaknesses.append("Core requirements for the job are largely unmet.")
    if len(resume_skills) < 3:
        weaknesses.append("Very few technical skills detected overall.")
        
    suggestions = []
    if missing_skills:
        suggestions.append(f"Consider learning or adding these specific skills if you have them: {', '.join(missing_skills)}.")
    if match_score < 100:
        suggestions.append("Ensure you use exactly the same keywords as mentioned in the JD. ATS systems look for exact matches.")
    if len(resume_skills) < 8:
        suggestions.append("Expand the technical skills section of your resume to include more relevant industry tools and frameworks.")

    return {
        "match_score": match_score,
        "missing_skills": missing_skills,
        "extracted_skills": list(resume_skills),
        "strengths": strengths,
        "weaknesses": weaknesses,
        "suggestions": suggestions
    }
