from app.ai.base import AIProvider

class MockAIProvider(AIProvider):
    """Mock implementation returning static realistic CS student data."""

    async def analyze_resume(self, resume_text: str) -> dict:
        return {
            "score": {
                "overall": 78,
                "technical_skills": 82,
                "experience": 65,
                "projects": 85,
                "education": 90,
                "keywords": 75,
                "formatting": 80,
                "ats_compatibility": 70
            },
            "skills": [
                {"name": "Python", "confidence": 95},
                {"name": "FastAPI", "confidence": 85},
                {"name": "React", "confidence": 80},
                {"name": "MongoDB", "confidence": 75},
                {"name": "Docker", "confidence": 60}
            ],
            "skill_categories": {
                "Programming Languages": ["Python", "JavaScript", "C++", "Java"],
                "Frameworks": ["FastAPI", "React", "Node.js"],
                "Databases": ["MongoDB", "PostgreSQL", "MySQL"],
                "AI/ML": ["TensorFlow", "PyTorch", "Scikit-Learn"],
                "Cloud/DevOps": ["Docker", "AWS", "GitHub Actions"],
                "Soft Skills": ["Teamwork", "Communication", "Problem Solving"],
                "Tools": ["Git", "Jira", "VS Code"]
            },
            "recommended_roles": [
                {"title": "Backend Developer", "match_percentage": 92, "matched_skills": ["Python", "FastAPI", "MongoDB"], "missing_skills": ["Redis", "Kubernetes"]},
                {"title": "Full Stack Engineer", "match_percentage": 88, "matched_skills": ["React", "Python", "Node.js"], "missing_skills": ["TypeScript", "GraphQL"]},
                {"title": "Data Engineer", "match_percentage": 82, "matched_skills": ["Python", "SQL", "MongoDB"], "missing_skills": ["Spark", "Airflow"]},
                {"title": "Machine Learning Engineer", "match_percentage": 78, "matched_skills": ["Python", "TensorFlow"], "missing_skills": ["MLOps", "Model Deployment"]},
                {"title": "DevOps Engineer", "match_percentage": 74, "matched_skills": ["Docker", "AWS"], "missing_skills": ["Terraform", "CI/CD Pipelines"]},
                {"title": "Frontend Developer", "match_percentage": 68, "matched_skills": ["React", "JavaScript"], "missing_skills": ["Next.js", "Tailwind CSS"]}
            ],
            "skill_gaps": [
                {"skill": "TypeScript", "status": "missing", "importance": "high"},
                {"skill": "Docker", "status": "improve", "importance": "medium"},
                {"skill": "Python", "status": "have", "importance": "high"}
            ],
            "career_recommendations": [
                {"title": "Focus on Backend", "reasoning": "Strong Python and API skills."},
                {"title": "Learn Cloud", "reasoning": "Deploying apps will complete your full-stack capability."}
            ],
            "roadmap": [
                {"week": 1, "topic": "Advanced Python", "difficulty": "Intermediate", "estimated_hours": 10, "skills_gained": ["Decorators", "Generators"], "resources": ["RealPython"]},
                {"week": 2, "topic": "FastAPI Deep Dive", "difficulty": "Intermediate", "estimated_hours": 15, "skills_gained": ["Dependency Injection", "WebSockets"], "resources": ["FastAPI Docs"]},
                {"week": 3, "topic": "MongoDB Optimization", "difficulty": "Advanced", "estimated_hours": 10, "skills_gained": ["Indexing", "Aggregation"], "resources": ["MongoDB University"]},
                {"week": 4, "topic": "Docker Containers", "difficulty": "Intermediate", "estimated_hours": 12, "skills_gained": ["Dockerfile", "Docker Compose"], "resources": ["Docker Docs"]},
                {"week": 5, "topic": "CI/CD Basics", "difficulty": "Intermediate", "estimated_hours": 8, "skills_gained": ["GitHub Actions"], "resources": ["GitHub Docs"]},
                {"week": 6, "topic": "React State Management", "difficulty": "Advanced", "estimated_hours": 15, "skills_gained": ["Redux", "Zustand"], "resources": ["React Docs"]},
                {"week": 7, "topic": "TypeScript Intro", "difficulty": "Beginner", "estimated_hours": 10, "skills_gained": ["Types", "Interfaces"], "resources": ["TypeScript Handbook"]},
                {"week": 8, "topic": "System Design", "difficulty": "Advanced", "estimated_hours": 20, "skills_gained": ["Scalability", "Architecture"], "resources": ["System Design Primer"]}
            ],
            "projects": [
                {"title": "E-Commerce API", "description": "Build a robust backend API", "skills_gained": ["FastAPI", "MongoDB"], "difficulty": "Intermediate", "resume_value": "high"},
                {"title": "Portfolio Website", "description": "Personal site", "skills_gained": ["React"], "difficulty": "Beginner", "resume_value": "medium"},
                {"title": "Dockerized Chat App", "description": "Realtime chat with WebSockets", "skills_gained": ["WebSockets", "Docker"], "difficulty": "Advanced", "resume_value": "high"},
                {"title": "ML Model API", "description": "Serve a PyTorch model", "skills_gained": ["PyTorch", "FastAPI"], "difficulty": "Intermediate", "resume_value": "high"},
                {"title": "Task Scheduler", "description": "Cron-like service", "skills_gained": ["Python", "Concurrency"], "difficulty": "Advanced", "resume_value": "medium"}
            ],
            "resume_improvements": [
                "Quantify achievements with metrics.",
                "Include a link to your GitHub.",
                "Highlight your open-source contributions.",
                "Use stronger action verbs.",
                "Tailor keywords for backend roles.",
                "Shorten the summary section.",
                "Add a dedicated tools section.",
                "Ensure formatting is consistent."
            ],
            "ai_summary": "Solid foundation in Python and React. Ready for a Junior Full Stack or Backend role.",
            "ai_insights": [
                "Strong theoretical background.",
                "Good mix of frontend and backend.",
                "Lacking deployment experience.",
                "Project section is impressive.",
                "Need more focus on data structures."
            ]
        }
