from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class SavedJob(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    user_id: str
    job_title: str
    company: str
    location: str
    application_url: str
    match_percentage: int
    required_skills: List[str]
    saved_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {
        "populate_by_name": True
    }
