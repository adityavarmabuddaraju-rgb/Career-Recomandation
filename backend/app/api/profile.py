from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
from bson.objectid import ObjectId

from app.auth.dependencies import get_current_user
from app.database import (
    get_saved_skills_collection, 
    get_saved_careers_collection,
    get_user_skills_collection,
    get_user_saved_careers_collection,
    get_user_profiles_collection
)
from app.services.ai_service import ai_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/profile", tags=["profile"])

# In-memory fallback store in case MongoDB is unreachable in local environment
_IN_MEMORY_SKILLS = {}   # user_id -> List[str]
_IN_MEMORY_CAREERS = {}  # user_id -> List[Dict]


# ─── Pydantic Schemas ─────────────────────────────────────────────────────────

class SaveSkillsRequest(BaseModel):
    skills: List[str] = Field(default_factory=list)


class SaveCareerRequest(BaseModel):
    career_name: str
    current_skills: List[str] = Field(default_factory=list)
    experience_level: Optional[str] = "Beginner"
    hours_per_day: Optional[str] = "2"
    target_timeline: Optional[str] = "2 months"
    roadmap_data: Optional[Dict[str, Any]] = Field(default_factory=dict)


class UpdateCareerRequest(BaseModel):
    career_name: Optional[str] = None
    current_skills: Optional[List[str]] = None
    experience_level: Optional[str] = None
    hours_per_day: Optional[str] = None
    target_timeline: Optional[str] = None
    regenerate: Optional[bool] = False


class MySkillRequest(BaseModel):
    name: str
    level: str = "Beginner"
    category: Optional[str] = None

class MySkillUpdate(BaseModel):
    level: str

class SaveSimpleCareerRequest(BaseModel):
    career_name: str
    career_slug: str

class UserProfileRequest(BaseModel):
    name: Optional[str] = None
    education: Optional[str] = None
    field_of_study: Optional[str] = None
    experience: Optional[str] = None
    location: Optional[str] = None
    work_type: Optional[str] = None
    interests: Optional[List[str]] = Field(default_factory=list)
    career_goals: Optional[str] = None

# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.get("/me")
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Retrieve logged-in user profile details."""
    return {
        "id": current_user.get("id"),
        "name": current_user.get("name", "User"),
        "email": current_user.get("email", ""),
    }


# ─── SAVED SKILLS ENDPOINTS ───────────────────────────────────────────────────

@router.get("/skills")
async def get_saved_skills(current_user: dict = Depends(get_current_user)):
    """Retrieve all saved skills for the logged-in user."""
    user_id = current_user["id"]
    try:
        skills_col = get_saved_skills_collection()
        if skills_col is not None:
            record = await skills_col.find_one({"user_id": user_id})
            if record:
                return {"skills": record.get("skills", [])}
    except Exception as e:
        logger.warning(f"DB error fetching saved skills: {e}")

    # Fallback to in-memory store
    return {"skills": _IN_MEMORY_SKILLS.get(user_id, [])}


@router.post("/skills")
async def add_saved_skills(request: SaveSkillsRequest, current_user: dict = Depends(get_current_user)):
    """
    Save or append new skills to user's profile.
    Deduplicates case-insensitively.
    """
    user_id = current_user["id"]
    existing_skills = (await get_saved_skills(current_user)).get("skills", [])
    
    # Case-insensitive deduplication
    existing_lower = {s.lower() for s in existing_skills}
    added_count = 0
    updated_skills = list(existing_skills)
    
    for s in request.skills:
        trimmed = s.strip()
        if trimmed and trimmed.lower() not in existing_lower:
            existing_lower.add(trimmed.lower())
            updated_skills.append(trimmed)
            added_count += 1

    now = datetime.utcnow().isoformat()
    
    try:
        skills_col = get_saved_skills_collection()
        if skills_col is not None:
            await skills_col.update_one(
                {"user_id": user_id},
                {"$set": {"skills": updated_skills, "updated_at": now}, "$setOnInsert": {"created_at": now}},
                upsert=True
            )
    except Exception as e:
        logger.warning(f"DB error updating skills: {e}")

    _IN_MEMORY_SKILLS[user_id] = updated_skills
    return {"skills": updated_skills, "added_count": added_count, "message": "Skills saved successfully!"}


@router.put("/skills")
async def update_saved_skills(request: SaveSkillsRequest, current_user: dict = Depends(get_current_user)):
    """Overwrite all saved skills for user."""
    user_id = current_user["id"]
    
    # Deduplicate
    unique_skills = []
    seen = set()
    for s in request.skills:
        trimmed = s.strip()
        if trimmed and trimmed.lower() not in seen:
            seen.add(trimmed.lower())
            unique_skills.append(trimmed)

    now = datetime.utcnow().isoformat()

    try:
        skills_col = get_saved_skills_collection()
        if skills_col is not None:
            await skills_col.update_one(
                {"user_id": user_id},
                {"$set": {"skills": unique_skills, "updated_at": now}, "$setOnInsert": {"created_at": now}},
                upsert=True
            )
    except Exception as e:
        logger.warning(f"DB error replacing skills: {e}")

    _IN_MEMORY_SKILLS[user_id] = unique_skills
    return {"skills": unique_skills, "message": "Saved skills updated successfully!"}


@router.delete("/skills/{skill_name}")
async def delete_saved_skill(skill_name: str, current_user: dict = Depends(get_current_user)):
    """Delete a single saved skill from user's profile."""
    user_id = current_user["id"]
    existing_skills = (await get_saved_skills(current_user)).get("skills", [])
    
    updated_skills = [s for s in existing_skills if s.lower() != skill_name.strip().lower()]
    now = datetime.utcnow().isoformat()

    try:
        skills_col = get_saved_skills_collection()
        if skills_col is not None:
            await skills_col.update_one(
                {"user_id": user_id},
                {"$set": {"skills": updated_skills, "updated_at": now}}
            )
    except Exception as e:
        logger.warning(f"DB error deleting skill: {e}")

    _IN_MEMORY_SKILLS[user_id] = updated_skills
    return {"skills": updated_skills, "message": f"Skill '{skill_name}' removed."}


# ─── SAVED CAREERS ENDPOINTS ──────────────────────────────────────────────────

@router.get("/careers")
async def get_saved_careers(current_user: dict = Depends(get_current_user)):
    """Retrieve all saved career goals for logged-in user."""
    user_id = current_user["id"]
    careers = []

    try:
        careers_col = get_saved_careers_collection()
        if careers_col is not None:
            cursor = careers_col.find({"user_id": user_id}).sort("created_at", -1)
            async for doc in cursor:
                doc["id"] = str(doc.pop("_id"))
                careers.append(doc)
            return {"careers": careers}
    except Exception as e:
        logger.warning(f"DB error fetching saved careers: {e}")

    # Fallback to in-memory store
    return {"careers": _IN_MEMORY_CAREERS.get(user_id, [])}


@router.post("/careers")
async def save_career_goal(request: SaveCareerRequest, current_user: dict = Depends(get_current_user)):
    """Save a new career goal with generated roadmap payload."""
    user_id = current_user["id"]
    now = datetime.utcnow().isoformat()

    career_doc = {
        "user_id": user_id,
        "career_name": request.career_name.strip(),
        "current_skills": request.current_skills,
        "experience_level": request.experience_level or "Beginner",
        "hours_per_day": request.hours_per_day or "2",
        "target_timeline": request.target_timeline or "2 months",
        "roadmap_data": request.roadmap_data or {},
        "created_at": now,
        "updated_at": now,
    }

    try:
        careers_col = get_saved_careers_collection()
        if careers_col is not None:
            result = await careers_col.insert_one(career_doc)
            career_doc["id"] = str(result.inserted_id)
            if "_id" in career_doc:
                del career_doc["_id"]
            return {"career": career_doc, "message": "Career goal saved to your profile!"}
    except Exception as e:
        logger.warning(f"DB error inserting saved career: {e}")

    # In-memory fallback
    career_doc["id"] = f"mem_{int(datetime.utcnow().timestamp()*1000)}"
    if user_id not in _IN_MEMORY_CAREERS:
        _IN_MEMORY_CAREERS[user_id] = []
    _IN_MEMORY_CAREERS[user_id].insert(0, career_doc)

    return {"career": career_doc, "message": "Career goal saved to your profile!"}


@router.get("/careers/{career_id}")
async def get_saved_career_by_id(career_id: str, current_user: dict = Depends(get_current_user)):
    """Retrieve single saved career goal by ID (loads pre-generated roadmap)."""
    user_id = current_user["id"]

    try:
        careers_col = get_saved_careers_collection()
        if careers_col is not None and ObjectId.is_valid(career_id):
            doc = await careers_col.find_one({"_id": ObjectId(career_id), "user_id": user_id})
            if doc:
                doc["id"] = str(doc.pop("_id"))
                return doc
    except Exception as e:
        logger.warning(f"DB error fetching career {career_id}: {e}")

    # In-memory check
    for item in _IN_MEMORY_CAREERS.get(user_id, []):
        if item.get("id") == career_id:
            return item

    raise HTTPException(status_code=404, detail="Saved career goal not found.")


@router.put("/careers/{career_id}")
async def update_saved_career(
    career_id: str,
    request: UpdateCareerRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Update saved career parameters (skills, time, timeline, career name).
    If regenerate is True, generates a fresh roadmap from AI and updates the record.
    """
    user_id = current_user["id"]
    existing = await get_saved_career_by_id(career_id, current_user)

    career_name = request.career_name.strip() if request.career_name else existing.get("career_name")
    current_skills = request.current_skills if request.current_skills is not None else existing.get("current_skills", [])
    experience_level = request.experience_level if request.experience_level else existing.get("experience_level", "Beginner")
    hours_per_day = request.hours_per_day if request.hours_per_day else existing.get("hours_per_day", "2")
    target_timeline = request.target_timeline if request.target_timeline else existing.get("target_timeline", "2 months")

    roadmap_data = existing.get("roadmap_data", {})

    if request.regenerate:
        logger.info(f"Regenerating roadmap for updated career: {career_name}")
        roadmap_data = await ai_service.analyze_target_career_mode2(
            target_career=career_name,
            skills=current_skills,
            experience_level=experience_level,
            hours_per_day=hours_per_day,
            timeframe=target_timeline,
        )

    now = datetime.utcnow().isoformat()
    update_fields = {
        "career_name": career_name,
        "current_skills": current_skills,
        "experience_level": experience_level,
        "hours_per_day": hours_per_day,
        "target_timeline": target_timeline,
        "roadmap_data": roadmap_data,
        "updated_at": now,
    }

    try:
        careers_col = get_saved_careers_collection()
        if careers_col is not None and ObjectId.is_valid(career_id):
            await careers_col.update_one(
                {"_id": ObjectId(career_id), "user_id": user_id},
                {"$set": update_fields}
            )
    except Exception as e:
        logger.warning(f"DB error updating career {career_id}: {e}")

    # Update in-memory fallback if present
    for item in _IN_MEMORY_CAREERS.get(user_id, []):
        if item.get("id") == career_id:
            item.update(update_fields)

    existing.update(update_fields)
    return {"career": existing, "message": "Career goal updated successfully!"}


@router.delete("/careers/{career_id}")
async def delete_saved_career(career_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a saved career goal from user profile."""
    user_id = current_user["id"]

    try:
        careers_col = get_saved_careers_collection()
        if careers_col is not None and ObjectId.is_valid(career_id):
            await careers_col.delete_one({"_id": ObjectId(career_id), "user_id": user_id})
    except Exception as e:
        logger.warning(f"DB error deleting career {career_id}: {e}")

    # Remove from memory fallback
    if user_id in _IN_MEMORY_CAREERS:
        _IN_MEMORY_CAREERS[user_id] = [c for c in _IN_MEMORY_CAREERS[user_id] if c.get("id") != career_id]

    return {"message": "Saved career goal removed."}

# ─── NEW PROFILE ENDPOINTS ────────────────────────────────────────────────────

@router.get("/my-skills")
async def get_my_skills(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    try:
        col = get_user_skills_collection()
        if col is not None:
            skills = []
            async for doc in col.find({"user_id": user_id}):
                doc["_id"] = str(doc["_id"])
                skills.append(doc)
            return {"skills": skills}
    except Exception as e:
        logger.warning(f"DB error: {e}")
    return {"skills": []}

@router.post("/my-skills")
async def add_my_skill(request: MySkillRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    try:
        col = get_user_skills_collection()
        if col is not None:
            existing = await col.find_one({"user_id": user_id, "name": {"$regex": f"^{request.name}$", "$options": "i"}})
            if existing:
                raise HTTPException(status_code=400, detail="Skill already exists")
            doc = request.dict()
            doc["user_id"] = user_id
            await col.insert_one(doc)
            doc["_id"] = str(doc["_id"])
            return {"message": "Skill added", "skill": doc}
    except HTTPException:
        raise
    except Exception as e:
        logger.warning(f"DB error: {e}")
    return {"message": "Skill added (fallback)"}

@router.put("/my-skills/{skill_name}")
async def update_my_skill(skill_name: str, request: MySkillUpdate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    try:
        col = get_user_skills_collection()
        if col is not None:
            await col.update_one(
                {"user_id": user_id, "name": {"$regex": f"^{skill_name}$", "$options": "i"}},
                {"$set": {"level": request.level}}
            )
            return {"message": "Skill updated"}
    except Exception as e:
        logger.warning(f"DB error: {e}")
    return {"message": "Skill updated (fallback)"}

@router.delete("/my-skills/{skill_name}")
async def delete_my_skill(skill_name: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    try:
        col = get_user_skills_collection()
        if col is not None:
            await col.delete_one({"user_id": user_id, "name": {"$regex": f"^{skill_name}$", "$options": "i"}})
            return {"message": "Skill removed"}
    except Exception as e:
        logger.warning(f"DB error: {e}")
    return {"message": "Skill removed (fallback)"}

@router.get("/saved-careers")
async def get_simple_saved_careers(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    try:
        col = get_user_saved_careers_collection()
        if col is not None:
            careers = []
            async for doc in col.find({"user_id": user_id}):
                doc["_id"] = str(doc["_id"])
                careers.append(doc)
            return {"careers": careers}
    except Exception as e:
        logger.warning(f"DB error: {e}")
    return {"careers": []}

@router.post("/saved-careers")
async def save_simple_career(request: SaveSimpleCareerRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    try:
        col = get_user_saved_careers_collection()
        if col is not None:
            existing = await col.find_one({"user_id": user_id, "career_slug": request.career_slug})
            if existing:
                raise HTTPException(status_code=400, detail="Career already saved")
            doc = request.dict()
            doc["user_id"] = user_id
            await col.insert_one(doc)
            doc["_id"] = str(doc["_id"])
            return {"message": "Career saved", "career": doc}
    except HTTPException:
        raise
    except Exception as e:
        logger.warning(f"DB error: {e}")
    return {"message": "Career saved (fallback)"}

@router.delete("/saved-careers/{career_slug}")
async def unsave_simple_career(career_slug: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    try:
        col = get_user_saved_careers_collection()
        if col is not None:
            await col.delete_one({"user_id": user_id, "career_slug": career_slug})
            return {"message": "Career removed"}
    except Exception as e:
        logger.warning(f"DB error: {e}")
    return {"message": "Career removed (fallback)"}

@router.get("/user-profile")
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    try:
        col = get_user_profiles_collection()
        if col is not None:
            profile = await col.find_one({"user_id": user_id})
            if profile:
                profile["_id"] = str(profile["_id"])
                return {"profile": profile}
    except Exception as e:
        logger.warning(f"DB error: {e}")
    return {"profile": {"name": current_user.get("name")}}

@router.put("/user-profile")
async def update_user_profile(request: UserProfileRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    try:
        col = get_user_profiles_collection()
        if col is not None:
            doc = {k: v for k, v in request.dict().items() if v is not None}
            await col.update_one(
                {"user_id": user_id},
                {"$set": doc},
                upsert=True
            )
            return {"message": "Profile updated", "profile": doc}
    except Exception as e:
        logger.warning(f"DB error: {e}")
    return {"message": "Profile updated (fallback)"}

