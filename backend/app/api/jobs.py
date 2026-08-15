from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from bson.objectid import ObjectId

from app.database import get_saved_jobs_collection
from app.auth.dependencies import get_current_user
from app.models.saved_job import SavedJob
from app.schemas.jobs import SaveJobRequest, SavedJobResponse
from app.services.job_service import JobService

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

@router.get("/search")
async def search_jobs(
    role: Optional[str] = Query(None, description="Target job role"),
    location: Optional[str] = Query(None, description="Preferred location"),
    keywords: Optional[str] = Query(None, description="Skills or keywords"),
    page: int = Query(1, ge=1),
    current_user: dict = Depends(get_current_user)
):
    """Search live jobs using Adzuna Job API (or structured fallback). Credentials are never exposed."""
    try:
        results = await JobService.search_jobs(
            role=role,
            location=location,
            keywords=keywords,
            page=page
        )
        return results
    except Exception as e:
        raise HTTPException(status_code=503, detail="Job search service temporarily unavailable.")

@router.post("/save", response_model=SavedJobResponse)
async def save_job(request: SaveJobRequest, current_user: dict = Depends(get_current_user)):
    jobs_collection = get_saved_jobs_collection()
    
    job = SavedJob(
        user_id=current_user["id"],
        **request.model_dump()
    )
    
    job_dict = job.model_dump(by_alias=True, exclude_none=True)
    result = await jobs_collection.insert_one(job_dict)
    
    job_dict["id"] = str(result.inserted_id)
    if "_id" in job_dict:
        del job_dict["_id"]
        
    return SavedJobResponse(**job_dict)

@router.get("/saved", response_model=List[SavedJobResponse])
async def get_saved_jobs(current_user: dict = Depends(get_current_user)):
    jobs_collection = get_saved_jobs_collection()
    
    cursor = jobs_collection.find({"user_id": current_user["id"]}).sort("saved_at", -1)
    jobs = await cursor.to_list(length=100)
    
    for job in jobs:
        job["id"] = str(job.pop("_id"))
        
    return jobs

@router.delete("/{job_id}")
@router.delete("/saved/{job_id}")
async def delete_job(job_id: str, current_user: dict = Depends(get_current_user)):
    jobs_collection = get_saved_jobs_collection()
    
    try:
        result = await jobs_collection.delete_one({"_id": ObjectId(job_id), "user_id": current_user["id"]})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Job not found")
        return {"message": "Job removed successfully"}
    except Exception:
        raise HTTPException(status_code=404, detail="Invalid job ID or job not found")
