from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

from app.services.ai_service import ai_service
from app.data.career_database import (
    get_all_careers,
    get_all_categories,
    get_career_by_slug,
    get_careers_by_category,
    search_careers
)

router = APIRouter(prefix="/api/career", tags=["career"])


class DiscoverSkillsRequest(BaseModel):
    skills: Optional[List[str]] = Field(default_factory=list)
    education: Optional[str] = None
    experience: Optional[str] = None
    interests: Optional[List[str]] = Field(default_factory=list)
    work_type: Optional[str] = None


class TargetCareerRequest(BaseModel):
    career: str
    skills: Optional[List[str]] = Field(default_factory=list)
    experience_level: Optional[str] = "Beginner"
    hours_per_day: Optional[str] = "2"
    timeframe: Optional[str] = "2 months"

class CompareCareersRequest(BaseModel):
    career_slugs: List[str]


@router.get("/database")
async def get_database_endpoint():
    """Returns all careers with lightweight fields."""
    all_c = get_all_careers()
    return [{
        "name": c["name"],
        "slug": c["slug"],
        "category": c["category"],
        "description": c["description"],
        "required_skills": c["required_skills"],
        "entry_level": c["entry_level"],
        "regulated": c["regulated"]
    } for c in all_c]


@router.get("/categories")
async def get_categories_endpoint():
    """Returns list of category names + count."""
    categories = get_all_categories()
    result = []
    all_c = get_all_careers()
    for cat in categories:
        count = sum(1 for c in all_c if c["category"] == cat)
        result.append({"name": cat, "count": count})
    return result


@router.get("/{slug}")
async def get_career_detail(slug: str):
    """Returns full career detail."""
    career = get_career_by_slug(slug)
    if not career:
        raise HTTPException(status_code=404, detail="Career not found.")
    return career


@router.post("/compare")
async def compare_careers(request: CompareCareersRequest):
    """Returns side-by-side comparison data for given slugs."""
    if len(request.career_slugs) < 2:
        raise HTTPException(status_code=400, detail="Please provide at least 2 careers to compare.")
    
    comparisons = []
    for slug in request.career_slugs:
        c = get_career_by_slug(slug)
        if c:
            comparisons.append(c)
    
    if not comparisons:
        raise HTTPException(status_code=404, detail="None of the provided careers were found.")
        
    return {"comparisons": comparisons}


@router.post("/discover")
async def discover_careers(request: DiscoverSkillsRequest):
    """
    OPTION 1: "I HAVE SKILLS"
    Analyzes current user skills (and optional ed/exp) and recommends matching careers.
    """
    if not request.skills or len(request.skills) == 0:
        if not request.interests and not request.education:
            raise HTTPException(status_code=400, detail="Please enter at least one skill, education, or interest.")
    
    result = await ai_service.analyze_skills_mode1(
        skills=request.skills,
        education=request.education,
        experience=request.experience,
        interests=request.interests,
        work_type=request.work_type
    )
    return result


@router.post("/target")
async def target_career(request: TargetCareerRequest):
    """
    OPTION 2: "I WANT A CAREER"
    Generates a structured, time-aware personalized career roadmap.
    """
    if not request.career or not request.career.strip():
        raise HTTPException(status_code=400, detail="Please select or enter your target career.")
    
    result = await ai_service.analyze_target_career_mode2(
        target_career=request.career.strip(),
        skills=request.skills or [],
        experience_level=request.experience_level or "Beginner",
        hours_per_day=request.hours_per_day or "2",
        timeframe=request.timeframe or "2 months"
    )
    return result
