from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class SaveJobRequest(BaseModel):
    job_title: str
    company: str
    location: str
    application_url: str
    match_percentage: int
    required_skills: List[str]

class SavedJobResponse(BaseModel):
    id: str
    user_id: str
    job_title: str
    company: str
    location: str
    application_url: str
    match_percentage: int
    required_skills: List[str]
    saved_at: datetime

class JobSearchParams(BaseModel):
    role: str
    location: Optional[str] = None
    keywords: Optional[List[str]] = None
