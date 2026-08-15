from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Dict, Any

class Analysis(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    resume_id: str
    user_id: str
    score: Dict[str, Any]
    skills: List[Dict[str, Any]]
    skill_categories: Dict[str, List[str]]
    recommended_roles: List[Dict[str, Any]]
    skill_gaps: List[Dict[str, Any]]
    career_recommendations: List[Dict[str, Any]]
    roadmap: List[Dict[str, Any]]
    projects: List[Dict[str, Any]]
    resume_improvements: List[str]
    ai_summary: str
    ai_insights: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {
        "populate_by_name": True
    }
