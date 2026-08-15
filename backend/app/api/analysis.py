from fastapi import APIRouter, Depends, HTTPException
from typing import List
from bson.objectid import ObjectId

from app.database import get_analyses_collection
from app.auth.dependencies import get_current_user
from app.schemas.analysis import AnalysisResponse, AnalysisSummaryResponse
from app.services.analysis_service import analyze_resume_service

router = APIRouter(prefix="/api/analysis", tags=["analysis"])

@router.post("/analyze/{resume_id}", response_model=AnalysisResponse)
async def analyze_resume_endpoint(resume_id: str, current_user: dict = Depends(get_current_user)):
    try:
        analysis_dict = await analyze_resume_service(resume_id, current_user["id"])
        return AnalysisResponse(**analysis_dict)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to analyze resume")

@router.get("/latest", response_model=AnalysisResponse)
async def get_latest_analysis(current_user: dict = Depends(get_current_user)):
    analyses_collection = get_analyses_collection()
    
    analysis = await analyses_collection.find_one(
        {"user_id": current_user["id"]},
        sort=[("created_at", -1)]
    )
    
    if not analysis:
        raise HTTPException(status_code=404, detail="No analysis found")
        
    analysis["id"] = str(analysis.pop("_id"))
    return AnalysisResponse(**analysis)

@router.get("/list", response_model=List[AnalysisSummaryResponse])
async def list_analyses(current_user: dict = Depends(get_current_user)):
    analyses_collection = get_analyses_collection()
    
    cursor = analyses_collection.find({"user_id": current_user["id"]}).sort("created_at", -1)
    analyses = await cursor.to_list(length=100)
    
    results = []
    for a in analyses:
        a_id = str(a["_id"])
        skills_count = len(a.get("skills", []))
        matches_count = len(a.get("recommended_roles", []))
        
        results.append(AnalysisSummaryResponse(
            id=a_id,
            resume_id=a["resume_id"],
            score=a.get("score", {}),
            skills_count=skills_count,
            matches_count=matches_count
        ))
    return results

@router.get("/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(analysis_id: str, current_user: dict = Depends(get_current_user)):
    analyses_collection = get_analyses_collection()
    
    analysis = await analyses_collection.find_one({"_id": ObjectId(analysis_id), "user_id": current_user["id"]})
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
        
    analysis["id"] = str(analysis.pop("_id"))
    return AnalysisResponse(**analysis)
