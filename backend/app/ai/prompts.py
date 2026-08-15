RESUME_ANALYSIS_PROMPT = """
You are an expert tech recruiter and AI resume analyzer. Analyze the provided resume text and generate a comprehensive JSON response.
Do NOT include markdown backticks around the JSON, just return raw valid JSON.

Extract and analyze the following information exactly according to this JSON schema:

{
  "score": {
    "overall": 0-100,
    "technical_skills": 0-100,
    "experience": 0-100,
    "projects": 0-100,
    "education": 0-100,
    "keywords": 0-100,
    "formatting": 0-100,
    "ats_compatibility": 0-100
  },
  "skills": [
    {
      "name": "string",
      "confidence": 0-100
    }
  ],
  "skill_categories": {
    "Programming Languages": ["string"],
    "Frameworks": ["string"],
    "Databases": ["string"],
    "AI/ML": ["string"],
    "Cloud/DevOps": ["string"],
    "Soft Skills": ["string"],
    "Tools": ["string"]
  },
  "recommended_roles": [
    {
      "title": "string",
      "match_percentage": 0-100,
      "matched_skills": ["string"],
      "missing_skills": ["string"]
    }
  ],
  "skill_gaps": [
    {
      "skill": "string",
      "status": "missing" | "improve" | "have",
      "importance": "high" | "medium" | "low"
    }
  ],
  "career_recommendations": [
    {
      "title": "string",
      "reasoning": "string"
    }
  ],
  "roadmap": [
    {
      "week": 1,
      "topic": "string",
      "difficulty": "Beginner" | "Intermediate" | "Advanced",
      "estimated_hours": 0-100,
      "skills_gained": ["string"],
      "resources": ["string"]
    }
  ],
  "projects": [
    {
      "title": "string",
      "description": "string",
      "skills_gained": ["string"],
      "difficulty": "Beginner" | "Intermediate" | "Advanced",
      "resume_value": "high" | "medium" | "low"
    }
  ],
  "resume_improvements": ["string"],
  "ai_summary": "string",
  "ai_insights": ["string"]
}

Resume Text:
{resume_text}
"""
