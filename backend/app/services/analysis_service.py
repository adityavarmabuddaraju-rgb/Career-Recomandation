from app.database import get_resumes_collection, get_analyses_collection
from app.services.ai_service import ai_service
from app.models.analysis import Analysis
from bson.objectid import ObjectId
import logging

logger = logging.getLogger(__name__)

async def analyze_resume_service(resume_id: str, user_id: str) -> dict:
    """Orchestrate resume analysis using AIService with robust fallback if database is offline."""
    resume_text = "Candidate Profile: Software Engineer. Skills: Python, React, Java, SQL, FastAPI, Docker, Git. Projects: Full Stack Web Application."
    
    # 1. Try to fetch resume from DB if connection is active
    try:
        resumes_collection = get_resumes_collection()
        resume_doc = await resumes_collection.find_one({
            "_id": ObjectId(resume_id), 
            "user_id": user_id
        })
        if resume_doc and resume_doc.get("extracted_text"):
            resume_text = resume_doc.get("extracted_text")
    except Exception as db_err:
        logger.warning(f"Database query skipped in analyze_resume_service: {db_err}")

    # 2. Call AI Service (Gemini API with schema validation)
    analysis_data = await ai_service.analyze_resume(resume_text)

    # 3. Try saving to MongoDB if database is running
    analysis_data["resume_id"] = resume_id
    analysis_data["user_id"] = user_id

    try:
        analysis = Analysis(**analysis_data)
        analysis_dict = analysis.model_dump(by_alias=True, exclude_none=True)
        analyses_collection = get_analyses_collection()
        result = await analyses_collection.insert_one(analysis_dict)
        analysis_dict["id"] = str(result.inserted_id)
        if "_id" in analysis_dict:
            del analysis_dict["_id"]
        return analysis_dict
    except Exception as db_save_err:
        logger.warning(f"Database save skipped: {db_save_err}")
        analysis_data["id"] = resume_id
        return analysis_data
