from pydantic import BaseModel
from typing import List, Dict, Any

class AnalysisResponse(BaseModel):
    id: str
    resume_id: str
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

class AnalysisSummaryResponse(BaseModel):
    id: str
    resume_id: str
    score: Dict[str, Any]
    skills_count: int
    matches_count: int
