import json
import logging
import os
import ssl
import certifi
import google.generativeai as genai
from typing import Dict, Any, List, Optional

from app.config import settings

logger = logging.getLogger(__name__)

# ─── Universal Multi-Domain Career Knowledge Base ─────────────────────────────

CAREER_KNOWLEDGE = {
    # 🎨 DESIGN & CREATIVE
    "UI/UX Designer": {
        "domain": "Design & Creative",
        "core_skills": ["Figma", "User Research", "Wireframing", "Prototyping", "Usability Testing", "UI Design", "Information Architecture"],
        "tools": ["Figma", "Adobe XD", "Miro", "InVision", "Maze"],
        "certifications": ["Google UX Design Professional Certificate", "Interaction Design Foundation (IxDF)", "Nielsen Norman Group UX"],
        "education": "Degree in Design, HCI, Interactive Media, or self-taught portfolio",
        "daily_work": "Research user needs, create wireframes and interactive prototypes, conduct usability tests, and design visual UI components.",
        "prerequisites": ["Design Principles & Typography", "Basic Visual Perception"],
        "beginner_topics": ["Design Fundamentals (Color Theory, Layout, Typography)", "Figma Core Tools & Components", "User-Centered Design Process", "Wireframing & Low-Fidelity Layouts"],
        "intermediate_topics": ["User Research Methods & Interviews", "Interactive Prototyping & Micro-interactions", "Design Systems & Component Libraries", "Usability Testing & Iteration"],
        "advanced_topics": ["Design System Architecture & Tokens", "Accessibility (WCAG 2.1) & Inclusive Design", "Mobile-First Design Strategy", "UX Metrics & Product Analytics"]
    },
    "Graphic Designer": {
        "domain": "Design & Creative",
        "core_skills": ["Photoshop", "Illustrator", "InDesign", "Branding", "Typography", "Color Theory", "Layout Design"],
        "tools": ["Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign", "Canva", "Figma"],
        "certifications": ["Adobe Certified Professional (Graphic Design)", "Coursera Graphic Design Specialization"],
        "education": "Degree in Fine Arts, Graphic Design, Communications, or portfolio",
        "daily_work": "Create visual concepts, brand identities, marketing materials, and digital graphics for web and print.",
        "prerequisites": ["Visual Composition", "Color Fundamentals"],
        "beginner_topics": ["Graphic Design Principles & Composition", "Adobe Illustrator Vector Design", "Adobe Photoshop Image Editing", "Typography Selection & Hierarchy"],
        "intermediate_topics": ["Brand Identity & Logo Design", "Layout & Grid Systems (InDesign)", "Digital Banner & Social Media Design", "Print Preparation & Color Prepress (CMYK)"],
        "advanced_topics": ["Complete Brand Guideline Development", "3D Graphic Elements & Packaging Design", "Creative Direction & Art Management", "Motion Graphics Integration"]
    },

    # 💰 FINANCE & ACCOUNTING
    "Financial Analyst": {
        "domain": "Finance & Banking",
        "core_skills": ["Financial Modelling", "Excel", "Financial Statements Analysis", "Valuation", "Accounting", "Data Analysis"],
        "tools": ["Microsoft Excel", "Power BI", "Bloomberg Terminal", "Tally", "QuickBooks"],
        "certifications": ["CFA Level 1", "Financial Modeling & Valuation Analyst (FMVA)", "CPA"],
        "education": "Degree in Finance, Accounting, Economics, or Business Administration",
        "daily_work": "Analyze financial performance, build valuation models, evaluate investment opportunities, and prepare financial reports.",
        "prerequisites": ["Basic Math & Accounting Concepts", "Excel Fundamentals"],
        "beginner_topics": ["Accounting Fundamentals (Income Statement, Balance Sheet, Cash Flow)", "Advanced Excel Functions (VLOOKUP, INDEX/MATCH, Pivot Tables)", "Financial Ratio Analysis", "Time Value of Money (NPV, IRR)"],
        "intermediate_topics": ["Financial Modeling & Forecasting", "Corporate Valuation Methods (DCF, Multiples)", "Data Visualization with Power BI / Tableau", "Corporate Finance & Capital Budgeting"],
        "advanced_topics": ["Investment Portfolio Analysis", "Financial Risk Assessment & Sensitivity Analysis", "Mergers & Acquisitions (M&A) Modeling", "Executive Financial Storytelling"]
    },

    # 🎓 EDUCATION & TEACHING
    "Teacher": {
        "domain": "Education & Teaching",
        "core_skills": ["Curriculum Design", "Classroom Management", "Pedagogy", "Assessment Design", "Communication", "Subject Knowledge"],
        "tools": ["Google Classroom", "Canvas LMS", "Kahoot", "Quizlet", "MS PowerPoint"],
        "certifications": ["Teaching Certification / Credential (B.Ed)", "National Board Certification", "TEFL / TESOL"],
        "education": "Degree in Education or specific subject area + Teaching License",
        "daily_work": "Plan and deliver engaging lessons, assess student learning, foster a positive classroom, and adapt instruction for diverse learners.",
        "prerequisites": ["Strong Communication Skills", "Subject Matter Mastery"],
        "beginner_topics": ["Educational Pedagogy & Learning Theories", "Lesson Planning & Objective Setting", "Classroom Management Fundamentals", "Basic Student Assessment Strategies"],
        "intermediate_topics": ["Differentiated Instruction for Diverse Learners", "Integrating Educational Technology Tools", "Formative & Summative Evaluation", "Parent & Community Engagement"],
        "advanced_topics": ["Curriculum Framework Development", "Educational Leadership & Mentorship", "Data-Driven Instructional Adjustment", "Inclusive & Special Education Practices"]
    },

    # 🏥 HEALTHCARE & ADMINISTRATION
    "Healthcare Administrator": {
        "domain": "Healthcare",
        "core_skills": ["Healthcare Operations", "Policy & Compliance", "Healthcare Finance", "EHR Systems", "Medical Coding", "Quality Improvement"],
        "tools": ["Epic Systems", "Cerner EHR", "MS Excel", "Medisoft", "Healthcare Analytics Software"],
        "certifications": ["FACHE (Fellow ACHE)", "Certified Medical Manager (CMM)", "CPHIMS"],
        "education": "Bachelor's/Master's in Healthcare Administration (MHA), Public Health (MPH), or Business (MBA)",
        "daily_work": "Manage healthcare facility operations, ensure compliance with health regulations, oversee budgets, and coordinate care workflows.",
        "prerequisites": ["Healthcare System Fundamentals", "Organizational Communication"],
        "beginner_topics": ["Healthcare Systems & Terminology", "Medical Records & Health Information Management", "Healthcare Ethics & Legal Compliance (HIPAA)", "Basic Medical Coding & Billing Concepts"],
        "intermediate_topics": ["Healthcare Financial Management & Budgeting", "Electronic Health Records (EHR) Operations", "Patient Quality & Safety Standards", "Healthcare Staffing & Resource Allocation"],
        "advanced_topics": ["Strategic Healthcare Leadership & Operations", "Healthcare Analytics & Population Health", "Regulatory Accreditation (Joint Commission)", "Hospital Risk Management"]
    },

    # 📣 MEDIA & CONTENT
    "Content Creator": {
        "domain": "Media & Creative",
        "core_skills": ["Content Strategy", "Copywriting", "Video Editing", "Social Media Management", "SEO Writing", "Storytelling"],
        "tools": ["Premiere Pro / CapCut", "Canva", "WordPress", "Grammarly", "Google Analytics", "Social Media Schedulers"],
        "certifications": ["HubSpot Content Marketing Certification", "Google Digital Marketing Certificate"],
        "education": "Degree in Communications, Marketing, Journalism, or creative portfolio",
        "daily_work": "Research, outline, draft, edit, and publish multimedia content tailored for digital platforms and target audiences.",
        "prerequisites": ["Creative Writing", "Basic Digital Tech Literacy"],
        "beginner_topics": ["Digital Storytelling & Copywriting Fundamentals", "Social Media Platform Algorithms & Trends", "Basic Graphic & Video Editing (CapCut/Canva)", "SEO Writing Basics"],
        "intermediate_topics": ["Content Editorial Calendar Planning", "Short-Form Video Production & Editing (Premiere)", "Audience Growth & Engagement Strategies", "Content Performance Analytics"],
        "advanced_topics": ["Omnichannel Content Strategy & Monetization", "Brand Partnership & Campaign Execution", "AI Content Tool Integration & Workflow", "Media Production & Creative Direction"]
    },

    # ⚙️ ENGINEERING (CIVIL)
    "Civil Engineer": {
        "domain": "Engineering",
        "core_skills": ["AutoCAD", "Structural Analysis", "Project Supervision", "Building Materials", "Surveying", "Estimation & Costing"],
        "tools": ["AutoCAD", "Revit", "STAAD Pro", "MS Project", "Total Station Surveying"],
        "certifications": ["Professional Engineer (PE) License", "FE Exam", "LEED Green Associate", "PMP"],
        "education": "Bachelor's Degree in Civil Engineering",
        "daily_work": "Design, plan, supervise, and inspect construction of infrastructure projects such as roads, bridges, and buildings.",
        "prerequisites": ["Physics & Mathematics", "Engineering Graphics"],
        "beginner_topics": ["Engineering Mechanics & Building Materials", "AutoCAD 2D Drafting Fundamentals", "Land Surveying & Leveling", "Basic Structural Concepts"],
        "intermediate_topics": ["Structural Analysis (STAAD Pro)", "Reinforced Concrete & Steel Design", "Construction Estimation & Quantity Surveying", "Project Planning with MS Project"],
        "advanced_topics": ["BIM (Building Information Modeling) with Revit", "Geotechnical & Foundation Engineering", "Infrastructure Infrastructure Management & Safety", "Building Code Compliance & Permitting"]
    },

    # 💻 TECHNOLOGY ROLES (Included alongside all other domains)
    "Software Developer": {
        "domain": "Technology",
        "core_skills": ["Programming", "DSA", "OOP", "DBMS", "SQL", "OS", "CN", "Git"],
        "tools": ["Git", "VS Code", "Docker", "Postman", "Linux"],
        "certifications": ["AWS Developer", "Oracle Certified Associate", "Meta Backend Developer"],
        "education": "Degree in CS/IT or self-taught with strong DSA/projects",
        "daily_work": "Design, develop, test, and maintain robust software applications and systems.",
        "prerequisites": ["Basic Logic & Math", "Computer Fundamentals"],
        "beginner_topics": ["Programming Fundamentals", "Version Control with Git & GitHub", "Basic SQL & Database Concepts", "Command Line & OS Basics"],
        "intermediate_topics": ["Data Structures & Algorithms (DSA)", "Object-Oriented Programming (OOP)", "RESTful API Design", "Relational & NoSQL DBMS"],
        "advanced_topics": ["Computer Networks & Protocols", "System Design & Scalability", "CI/CD Pipelines & Containerization", "Testing & Performance Optimization"]
    },
    "Data Analyst": {
        "domain": "Technology & Business",
        "core_skills": ["Excel", "SQL", "Statistics", "Python", "Pandas", "Data Visualization", "Power BI / Tableau"],
        "tools": ["Excel", "SQL Server / PostgreSQL", "Jupyter", "Power BI", "Tableau", "Python"],
        "certifications": ["Google Data Analytics Professional", "Microsoft Certified: Power BI Data Analyst", "IBM Data Analyst"],
        "education": "Degree in Mathematics, Business, CS, Economics, or related field",
        "daily_work": "Clean, analyze, and visualize data to help stakeholders make data-driven decisions.",
        "prerequisites": ["Basic Math & Excel Knowledge", "Analytical Mindset"],
        "beginner_topics": ["Advanced Excel (Pivot Tables, VLOOKUP, XLOOKUP)", "SQL Queries (SELECT, JOINs, Group By)", "Descriptive Statistics", "Data Visualization Principles"],
        "intermediate_topics": ["Python for Data Analysis (Pandas, NumPy)", "Interactive Dashboards in Power BI / Tableau", "Exploratory Data Analysis (EDA)", "Data Cleaning & Preparation"],
        "advanced_topics": ["Business Intelligence & Reporting Strategy", "A/B Testing & Hypothesis Testing", "SQL Window Functions & Optimization", "Data Storytelling & Executive Presentation"]
    }
}


class AIService:
    """
    Universal multi-domain qualitative career advisor.
    DO NOT ASSUME CSE / Software background.
    Supports Design, Business, Finance, Education, Healthcare, Creative, Engineering, Science & Tech.
    """

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if self.api_key:
            try:
                # Fix SSL certificate verification on Windows
                os.environ.setdefault('SSL_CERT_FILE', certifi.where())
                os.environ.setdefault('REQUESTS_CA_BUNDLE', certifi.where())
                genai.configure(api_key=self.api_key)
            except Exception as e:
                logger.error(f"Error initializing Gemini SDK: {e}")

    async def _call_gemini(self, prompt: str) -> Optional[Dict[str, Any]]:
        """Try Gemini models in sequence, return parsed JSON or None."""
        models_to_try = ['gemini-1.5-flash-8b', 'gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro']
        last_error = None

        for model_name in models_to_try:
            try:
                model = genai.GenerativeModel(model_name)
                response = await model.generate_content_async(prompt)
                text = response.text.strip()
                for prefix in ["```json", "```"]:
                    if text.startswith(prefix):
                        text = text[len(prefix):]
                if text.endswith("```"):
                    text = text[:-3]
                result = json.loads(text.strip())
                logger.info(f"Gemini call succeeded with model: {model_name}")
                return result
            except Exception as e:
                logger.warning(f"Gemini model {model_name} failed: {e}")
                last_error = e

        logger.error(f"All Gemini models failed. Last error: {last_error}")
        return None

    async def analyze_skills_mode1(
        self, 
        skills: List[str],
        education: Optional[str] = None,
        experience: Optional[str] = None,
        interests: Optional[List[str]] = None,
        work_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Option 1: "I HAVE SKILLS"
        Analyzes user skills across ANY domain (Design, Finance, Education, Health, Creative, Engineering, Tech, etc.).
        DO NOT default to CSE or Software Developer unless user skills support it.
        """
        if not self.api_key:
            return self._fallback_mode1(skills)

        skills_text = ", ".join(skills) if skills else "None listed"
        interests_text = ", ".join(interests) if interests else "None listed"

        prompt = f"""You are a universal AI Career Advisor across ALL professional domains.

A user has provided the following profile information:
- Skills: {skills_text}
- Education: {education or "Not specified"}
- Experience: {experience or "Not specified"}
- Interests: {interests_text}
- Preferred Work Type: {work_type or "Not specified"}


Analyze these skills and recommend 4 to 6 suitable career roles across ANY relevant domain — such as:
- Design & Creative (UI/UX Designer, Graphic Designer, Product Designer, UX Researcher)
- Business & Management (Business Analyst, Product Manager, Digital Marketing, Project Manager)
- Finance & Accounting (Financial Analyst, Accountant, Investment Analyst, Banking)
- Education & Teaching (Teacher, Instructional Designer, EdTech Specialist)
- Healthcare & Admin (Healthcare Administrator, Health Informatics, Medical Coding)
- Media & Content (Content Creator, Copywriter, Video Editor, Media Specialist)
- Engineering & Science (Civil Engineer, Mechanical Engineer, Electrical Engineer, Research Scientist)
- Technology (Software Developer, Full Stack, Data Analyst, Cloud Engineer, DevOps, Cybersecurity, etc.)

STRICT RULES:
1. DO NOT assume the user is a Computer Science (CSE) or Software Engineering student unless their skills specifically indicate coding.
   - Example: If user skills are "Figma, Photoshop, UI design", recommend UI/UX Designer, Graphic Designer, Product Designer, UX Researcher. DO NOT recommend Software Developer!
   - Example: If user skills are "Accounting, Excel, Tally", recommend Financial Analyst, Accountant, Tax Consultant.
   - Example: If user skills are "Communication, teaching, English", recommend Teacher, Content Writer, Instructional Designer.
2. NO percentages, eligibility scores, or numbers anywhere.
3. Use ONLY these qualitative fit categories:
   - "Strong foundation" (🟢)
   - "Good starting point" (🟡)
   - "Needs improvement" (🟧)
   - "Skills to learn" (🔵)
4. Output realistic domain-specific tool recommendations, interview topics, and projects matching that exact career.

RETURN ONLY VALID JSON matching this structure:
{{
  "career_fits": [
    {{
      "career": "UI/UX Designer",
      "domain": "Design & Creative",
      "fit_category": "Strong foundation",
      "fit_icon": "🟢",
      "why_suitable": [
        "Your Figma experience allows you to start prototyping interfaces immediately.",
        "Understanding of user interface design maps directly to user-centered digital products."
      ],
      "skills_you_have": ["Figma", "UI Design"],
      "missing_skills": ["User Research", "Wireframing", "Usability Testing", "Design Systems"],
      "what_to_learn_next": ["User Research Methods", "Low-Fidelity Wireframing", "Figma Auto-Layout & Design Systems"],
      "roadmap_stages": {{
        "beginner": ["Design Principles & Typography", "Figma Essentials", "Wireframing"],
        "intermediate": ["User Research Methods", "Interactive Prototyping", "Design Systems"],
        "advanced": ["Usability Testing", "Accessibility (WCAG)", "Mobile-First Design Strategy"]
      }},
      "recommended_tools": ["Figma", "Adobe XD", "Miro", "Maze"],
      "interview_topics": ["Portfolio Case Study Presentation", "Design Thinking Process", "Usability Testing & Iteration", "Design System Components"],
      "projects": [
        {{
          "name": "Mobile E-Commerce App UI Redesign",
          "difficulty": "Intermediate",
          "estimated_time": "2 weeks",
          "technologies": ["Figma", "Miro", "Usability Testing"],
          "features": ["User Persona", "Wireframe", "High-Fidelity Prototype", "Usability Test Report"],
          "resume_bullet": "Redesigned a mobile e-commerce application UI in Figma, creating interactive prototypes and conducting usability tests with 5 test users."
        }}
      ]
    }}
  ]
}}

USER PROFILE:
Skills: {skills_text}
Education: {education or 'Not specified'}
Experience: {experience or 'Not specified'}
Interests: {interests_text}
Work Type: {work_type or 'Not specified'}
"""

        result = await self._call_gemini(prompt)
        if result and "career_fits" in result:
            return result
        return self._fallback_mode1(skills)

    async def analyze_target_career_mode2(
        self,
        target_career: str,
        skills: List[str] = None,
        experience_level: str = "Beginner",
        hours_per_day: str = "2",
        timeframe: str = "2 months"
    ) -> Dict[str, Any]:
        """
        Option 2: "I WANT A CAREER"
        Generates a highly detailed, personalized, time-based career roadmap.
        Organized by Levels (Foundation, Core Skills, Advanced, Job Ready), Weeks, Skills, Topics, and Subtopics.
        """
        skills = skills or []
        skills_text = ", ".join(skills) if skills else "Starting from basic level"

        career_key = next((k for k in CAREER_KNOWLEDGE if k.lower() in target_career.lower() or target_career.lower() in k.lower()), None)
        kb_info = CAREER_KNOWLEDGE.get(career_key, {})

        prompt = f"""You are an expert universal AI Career Advisor and Learning Planner.

A user wants to pursue the career: {target_career}
- Current Skills: {skills_text}
- Starting Level: {experience_level}
- Hours Per Day to Learn: {hours_per_day}
- Target Timeline: {timeframe}

CREATE A HIGHLY DETAILED, NESTED LEARNING ROADMAP FOLLOWING THESE STRICT RULES:

1. NO PERCENTAGES, fake scores, or hiring probability metrics.
2. ADAPT TO TIMEFRAME & HOURS: Group the learning plan into logical "Weeks" (e.g., Week 1, Week 2).
   Adjust the density of weeks based on the {hours_per_day} hours/day over {timeframe}.
3. 4 STRICT LEVELS:
   - LEVEL 1 — FOUNDATION: The absolute basics.
   - LEVEL 2 — CORE SKILLS: Skills used in the actual job.
   - LEVEL 3 — ADVANCED: Advanced tools and concepts.
   - LEVEL 4 — JOB READY: Projects + portfolio + interview prep.
4. DETAILED TOPICS & SUBTOPICS: Do NOT just list "Python" or "Figma". Expand every skill into topics (e.g. "Data Structures") and subtopics (e.g. "Lists, Tuples").
5. PROJECTS: Projects MUST follow the skills. A mini-task should follow a skill, and larger portfolio projects belong in LEVEL 4.

RETURN ONLY VALID JSON MATCHING THIS EXACT NESTED STRUCTURE:
{{
  "career_overview": {{
    "title": "{target_career}",
    "domain": "{kb_info.get('domain', 'Professional Field')}",
    "role_description": "{kb_info.get('daily_work', 'Performs core professional responsibilities.')}",
    "important_technologies": {json.dumps(kb_info.get('tools', ['Domain Tools']))}
  }},
  "roadmap_levels": [
    {{
      "level_name": "LEVEL 1 — FOUNDATION",
      "level_description": "Learn the absolute basics.",
      "weeks": [
        {{
          "week_name": "Week 1",
          "skills": [
            {{
              "skill_name": "Core Fundamentals",
              "why_needed": "A 1-2 sentence explanation of why this skill is essential.",
              "topics": [
                {{
                  "topic_name": "Topic Category 1",
                  "subtopics": ["Specific Concept 1", "Specific Concept 2"]
                }}
              ],
              "practice": "What the learner should practice (e.g. 20 coding problems)",
              "mini_task": "A small task to confirm understanding",
              "estimated_time": "e.g., 3-5 days",
              "prerequisites": ["What to know before starting"],
              "next_skill": "The logical next skill to learn"
            }}
          ]
        }}
      ]
    }}
  ],
  "interview_preparation": {{
    "technical_topics": ["Domain Terminology", "Industry Best Practices"],
    "coding_topics": ["Scenario Problem Solving", "Case Study Walkthroughs"],
    "sql_dbms_questions": ["Key Metrics", "Data Management"],
    "hr_prep": ["Walk me through a project", "Why do you want to become a {target_career}?"]
  }}
}}

Ensure you generate all 4 levels (LEVEL 1, LEVEL 2, LEVEL 3, LEVEL 4).
For LEVEL 4, make the "skills" focus on Portfolio Projects and Interview Prep.

TARGET CAREER: {target_career}
USER SKILLS: {skills_text}
EXPERIENCE: {experience_level}
HOURS PER DAY: {hours_per_day}
TIMEFRAME: {timeframe}
"""

        result = await self._call_gemini(prompt)
        if result and "career_overview" in result:
            return result
        return self._fallback_mode2(target_career, skills, experience_level, hours_per_day, timeframe)

    # ─── Smart Multi-Domain Fallbacks ──────────────────────────────────────────

    def _fallback_mode1(self, skills: List[str]) -> Dict[str, Any]:
        skills_str = " ".join(skills).lower()

        # Design detection
        if any(w in skills_str for w in ['figma', 'photoshop', 'ui', 'ux', 'sketch', 'illustrator', 'design', 'wireframe']):
            return {
                "career_fits": [
                    {
                        "career": "UI/UX Designer",
                        "domain": "Design & Creative",
                        "fit_category": "Strong foundation",
                        "fit_icon": "🟢",
                        "why_suitable": ["Your design skills map directly to digital UI/UX creation.", "Understanding interface layout allows creating user-centered designs."],
                        "skills_you_have": [s for s in skills if any(w in s.lower() for w in ['figma', 'photoshop', 'ui', 'ux', 'design'])],
                        "missing_skills": ["User Research", "Wireframing", "Usability Testing", "Design Systems"],
                        "what_to_learn_next": ["User Research Methods", "Figma Auto-Layout", "Interactive Prototyping"],
                        "roadmap_stages": {
                            "beginner": ["Design Fundamentals & Typography", "Figma Core Tools", "Wireframing"],
                            "intermediate": ["User Research Methods", "Interactive Prototyping", "Design Systems"],
                            "advanced": ["Usability Testing", "Accessibility (WCAG)", "Mobile-First Design Strategy"]
                        },
                        "recommended_tools": ["Figma", "Adobe XD", "Miro", "Maze"],
                        "interview_topics": ["Portfolio Case Study Presentation", "Design Thinking Process", "Usability Testing"],
                        "projects": [
                            {
                                "name": "Mobile E-Commerce App UI Redesign",
                                "difficulty": "Intermediate",
                                "estimated_time": "2 weeks",
                                "technologies": ["Figma", "Miro"],
                                "features": ["User Persona", "Wireframes", "High-Fidelity Prototype"],
                                "resume_bullet": "Redesigned a mobile e-commerce application UI in Figma, creating interactive prototypes and user flows."
                            }
                        ]
                    },
                    {
                        "career": "Graphic Designer",
                        "domain": "Design & Creative",
                        "fit_category": "Good starting point",
                        "fit_icon": "🟡",
                        "why_suitable": ["Visual composition skills transfer directly to brand and graphic design."],
                        "skills_you_have": [s for s in skills if any(w in s.lower() for w in ['photoshop', 'design', 'illustrator'])],
                        "missing_skills": ["Adobe Illustrator Vector Design", "Typography Hierarchy", "Branding Guidelines"],
                        "what_to_learn_next": ["Adobe Illustrator", "Brand Identity Design"],
                        "roadmap_stages": {
                            "beginner": ["Composition & Color Theory", "Illustrator Vector Design"],
                            "intermediate": ["Brand Identity Systems", "Layout Design"],
                            "advanced": ["Creative Direction", "Packaging Design"]
                        },
                        "recommended_tools": ["Adobe Photoshop", "Adobe Illustrator", "InDesign"],
                        "interview_topics": ["Brand Identity Case Study", "Vector Graphics", "Typography"],
                        "projects": [
                            {
                                "name": "Complete Brand Identity Package",
                                "difficulty": "Intermediate",
                                "estimated_time": "2 weeks",
                                "technologies": ["Adobe Illustrator", "Photoshop"],
                                "features": ["Logo Guidelines", "Color Palette", "Mockups"],
                                "resume_bullet": "Created a complete brand identity package including logo, typography guidelines, and brand mockups."
                            }
                        ]
                    }
                ]
            }

        # Finance detection
        if any(w in skills_str for w in ['excel', 'accounting', 'finance', 'tally', 'tax', 'balance', 'audit']):
            return {
                "career_fits": [
                    {
                        "career": "Financial Analyst",
                        "domain": "Finance & Banking",
                        "fit_category": "Strong foundation",
                        "fit_icon": "🟢",
                        "why_suitable": ["Your accounting and Excel background provides a direct entry into financial analysis."],
                        "skills_you_have": [s for s in skills if any(w in s.lower() for w in ['excel', 'accounting', 'tally', 'finance'])],
                        "missing_skills": ["Financial Modelling", "DCF Valuation", "Power BI Dashboards"],
                        "what_to_learn_next": ["Advanced Excel (VLOOKUP, Pivot Tables)", "Financial Statement Analysis", "Financial Modelling"],
                        "roadmap_stages": {
                            "beginner": ["Accounting Fundamentals", "Advanced Excel"],
                            "intermediate": ["Financial Modeling & Forecasting", "Valuation Methods"],
                            "advanced": ["Portfolio Risk Analysis", "Executive Reporting"]
                        },
                        "recommended_tools": ["Microsoft Excel", "Power BI", "QuickBooks"],
                        "interview_topics": ["Three Financial Statements Integration", "DCF Valuation Steps", "NPV & IRR Calculation"],
                        "projects": [
                            {
                                "name": "3-Statement Corporate Financial Model",
                                "difficulty": "Intermediate",
                                "estimated_time": "2 weeks",
                                "technologies": ["Microsoft Excel"],
                                "features": ["Income Statement", "Balance Sheet", "Cash Flow Forecast"],
                                "resume_bullet": "Built an integrated 3-statement financial model in Excel forecasting revenue and cash flow for 3 fiscal years."
                            }
                        ]
                    }
                ]
            }

        # Default multi-domain fallback
        return {
            "career_fits": [
                {
                    "career": "Business Analyst",
                    "domain": "Business & Management",
                    "fit_category": "Good starting point",
                    "fit_icon": "🟡",
                    "why_suitable": ["Problem-solving and communication skills map directly to business process analysis."],
                    "skills_you_have": skills[:3] if skills else ["Communication"],
                    "missing_skills": ["Requirements Gathering", "Process Mapping (BPMN)", "Data Visualization"],
                    "what_to_learn_next": ["Excel Data Analysis", "BPMN Process Mapping", "JIRA Workflow Basics"],
                    "roadmap_stages": {
                        "beginner": ["Business Process Basics", "Excel for Business Analysis"],
                        "intermediate": ["Requirements Elicitation", "Data Dashboards (Power BI)"],
                        "advanced": ["Strategic Business Change", "Executive Negotiation"]
                    },
                    "recommended_tools": ["JIRA", "Lucidchart", "Excel", "Power BI"],
                    "interview_topics": ["Requirements Gathering Methods", "Agile vs Waterfall", "Process Optimization"],
                    "projects": [
                        {
                            "name": "Business Process Optimization Case Study",
                            "difficulty": "Intermediate",
                            "estimated_time": "2 weeks",
                            "technologies": ["Lucidchart", "Excel"],
                            "features": ["As-Is Process Map", "To-Be Process Model", "Gap Analysis"],
                            "resume_bullet": "Analyzed business workflow bottlenecks and created optimized process maps in Lucidchart, reducing process friction."
                        }
                    ]
                }
            ]
        }

    def _fallback_mode2(
        self,
        target_career: str,
        skills: List[str] = None,
        experience_level: str = "Beginner",
        hours_per_day: str = "2",
        timeframe: str = "2 months"
    ) -> Dict[str, Any]:
        from app.data.career_database import get_all_careers

        skills = skills or []
        skills_lower = {s.strip().lower() for s in skills}

        # Find the best matching career from the database
        all_careers = get_all_careers()
        db_career = None
        target_lower = target_career.lower().strip()

        # Exact slug match first
        for c in all_careers:
            if c["slug"] == target_lower.replace(" ", "-"):
                db_career = c
                break

        # Then name match
        if not db_career:
            for c in all_careers:
                if c["name"].lower() == target_lower:
                    db_career = c
                    break

        # Then partial match
        if not db_career:
            for c in all_careers:
                if target_lower in c["name"].lower() or c["name"].lower() in target_lower:
                    db_career = c
                    break

        # Fallback to CAREER_KNOWLEDGE if no DB match
        if not db_career:
            career_key = next((k for k in CAREER_KNOWLEDGE if k.lower() in target_lower or target_lower in k.lower()), None)
            kb = CAREER_KNOWLEDGE.get(career_key, {})
            domain = kb.get("domain", "Professional Field")
            tools = kb.get("tools", ["Industry Standard Tools"])
            beg_topics = kb.get("beginner_topics", ["Core Fundamentals", "Basic Tool Usage"])
            int_topics = kb.get("intermediate_topics", ["Applied Projects", "Workflow Mastery"])
            adv_topics = kb.get("advanced_topics", ["Expert Strategy", "Industry Leadership"])
            req_skills = beg_topics[:4]
            certs = kb.get("certifications", [])
        else:
            domain = db_career.get("category", "Professional Field")
            tools = db_career.get("tools", [])
            req_skills = db_career.get("required_skills", [])
            beg_topics = db_career.get("beginner_roadmap", [])
            int_topics = db_career.get("intermediate_roadmap", [])
            adv_topics = db_career.get("advanced_roadmap", [])
            certs = db_career.get("certifications", [])

        # Figure out which required skills the user already has
        user_has = [s for s in req_skills if any(s.strip().lower() in us or us in s.strip().lower() for us in skills_lower)]
        user_missing = [s for s in req_skills if s not in user_has]

        return {
            "career_overview": {
                "title": target_career,
                "domain": domain,
                "role_description": db_career.get("description", f"Performs professional responsibilities as a {target_career}.") if db_career else f"Performs professional responsibilities as a {target_career}.",
                "important_technologies": tools[:6]
            },
            "skill_gap_analysis": {
                "skills_you_have": user_has or skills[:3],
                "critical_missing": user_missing[:4],
                "good_to_have": (db_career.get("supporting_skills", []) if db_career else [])[:4],
                "your_readiness": "Good" if len(user_has) >= 2 else "Needs Work"
            },
            "roadmap_levels": [
                {
                    "level_name": "LEVEL 1 — FOUNDATION",
                    "level_description": f"Learn the core {target_career} fundamentals from scratch.",
                    "weeks": [
                        {
                            "week_name": "Week 1",
                            "skills": [
                                {
                                    "skill_name": beg_topics[0] if beg_topics else f"{target_career} Basics",
                                    "why_needed": f"This is the entry-point skill every {target_career} must master first.",
                                    "topics": [
                                        {
                                            "topic_name": beg_topics[0] if beg_topics else "Core Basics",
                                            "subtopics": beg_topics[:3] if beg_topics else ["Foundations", "Key Concepts", "Basic Tools"]
                                        }
                                    ],
                                    "practice": f"Complete a beginner exercise covering {beg_topics[0] if beg_topics else 'core fundamentals'}",
                                    "mini_task": f"Build a simple project demonstrating {beg_topics[1] if len(beg_topics) > 1 else 'basic skills'}",
                                    "estimated_time": "4-5 days",
                                    "prerequisites": ["None — start here"],
                                    "next_skill": beg_topics[1] if len(beg_topics) > 1 else "Core Tools"
                                }
                            ]
                        },
                        {
                            "week_name": "Week 2",
                            "skills": [
                                {
                                    "skill_name": beg_topics[1] if len(beg_topics) > 1 else f"{tools[0] if tools else 'Primary Tool'} Basics",
                                    "why_needed": "Gives you the practical tool knowledge needed in the field.",
                                    "topics": [
                                        {
                                            "topic_name": beg_topics[1] if len(beg_topics) > 1 else "Tool Fundamentals",
                                            "subtopics": beg_topics[1:4] if len(beg_topics) > 1 else ["Setup & Configuration", "Core Features", "First Project"]
                                        }
                                    ],
                                    "practice": f"Set up {tools[0] if tools else 'primary tool'} and complete the official getting-started guide",
                                    "mini_task": f"Complete one hands-on exercise using {tools[0] if tools else 'the main tool'}",
                                    "estimated_time": "4-5 days",
                                    "prerequisites": [beg_topics[0] if beg_topics else "Core Basics"],
                                    "next_skill": int_topics[0] if int_topics else "Intermediate Skills"
                                }
                            ]
                        }
                    ]
                },
                {
                    "level_name": "LEVEL 2 — CORE SKILLS",
                    "level_description": f"Develop hands-on proficiency in key {target_career} skills.",
                    "weeks": [
                        {
                            "week_name": "Week 3",
                            "skills": [
                                {
                                    "skill_name": int_topics[0] if int_topics else f"Advanced {target_career} Techniques",
                                    "why_needed": "Core skill that employers look for in every job description.",
                                    "topics": [
                                        {
                                            "topic_name": int_topics[0] if int_topics else "Professional Techniques",
                                            "subtopics": int_topics[:3] if int_topics else ["Applied Practice", "Real Workflows", "Industry Standards"]
                                        }
                                    ],
                                    "practice": f"Apply {int_topics[0] if int_topics else 'intermediate skills'} to a real scenario",
                                    "mini_task": f"Build a working mini-project using {tools[1] if len(tools) > 1 else tools[0] if tools else 'main tools'}",
                                    "estimated_time": "1 week",
                                    "prerequisites": [beg_topics[0] if beg_topics else "Foundation"],
                                    "next_skill": int_topics[1] if len(int_topics) > 1 else "Advanced Practice"
                                }
                            ]
                        },
                        {
                            "week_name": "Week 4",
                            "skills": [
                                {
                                    "skill_name": int_topics[1] if len(int_topics) > 1 else f"{tools[1] if len(tools) > 1 else 'Secondary Tool'} Mastery",
                                    "why_needed": "Differentiates you from other entry-level candidates.",
                                    "topics": [
                                        {
                                            "topic_name": int_topics[1] if len(int_topics) > 1 else "Tool Mastery",
                                            "subtopics": int_topics[1:4] if len(int_topics) > 1 else ["Advanced Features", "Optimization", "Team Workflows"]
                                        }
                                    ],
                                    "practice": f"Work on an end-to-end {target_career} workflow",
                                    "mini_task": f"Create a portfolio-worthy deliverable using {int_topics[1] if len(int_topics) > 1 else 'advanced skills'}",
                                    "estimated_time": "1 week",
                                    "prerequisites": [int_topics[0] if int_topics else "Core Skills"],
                                    "next_skill": adv_topics[0] if adv_topics else "Advanced Strategy"
                                }
                            ]
                        }
                    ]
                },
                {
                    "level_name": "LEVEL 3 — ADVANCED",
                    "level_description": f"Master expert-level {target_career} skills and industry readiness.",
                    "weeks": [
                        {
                            "week_name": "Week 5-6",
                            "skills": [
                                {
                                    "skill_name": adv_topics[0] if adv_topics else f"Expert {target_career} Practice",
                                    "why_needed": "Separates junior candidates from job-ready professionals.",
                                    "topics": [
                                        {
                                            "topic_name": adv_topics[0] if adv_topics else "Expert Level",
                                            "subtopics": adv_topics[:4] if adv_topics else ["Advanced Methods", "Complex Projects", "Professional Standards", "Industry Tools"]
                                        }
                                    ],
                                    "practice": f"Tackle a complex {target_career} challenge independently",
                                    "mini_task": f"Replicate a real-world {target_career} scenario and document your approach",
                                    "estimated_time": "2 weeks",
                                    "prerequisites": [int_topics[0] if int_topics else "Core Skills"],
                                    "next_skill": "Portfolio Project"
                                }
                            ]
                        }
                    ]
                },
                {
                    "level_name": "LEVEL 4 — JOB READY",
                    "level_description": "Build your portfolio, prepare for interviews, and land the job.",
                    "weeks": [
                        {
                            "week_name": "Week 7-8",
                            "skills": [
                                {
                                    "skill_name": "Portfolio & Interview Preparation",
                                    "why_needed": "Your portfolio and interview skills close the gap between learning and being hired.",
                                    "topics": [
                                        {
                                            "topic_name": "Final Project & Interview Prep",
                                            "subtopics": [
                                                f"Build a complete {target_career} portfolio project",
                                                f"Prepare for common {target_career} interview questions",
                                                f"Study for {certs[0] if certs else 'relevant certifications'}",
                                                "Update LinkedIn profile with your new skills",
                                                "Apply to entry-level positions"
                                            ]
                                        }
                                    ],
                                    "practice": f"Complete a full {target_career} project and document it on GitHub or your portfolio",
                                    "mini_task": "Do 5 mock interviews or case study walkthroughs",
                                    "estimated_time": "2 weeks",
                                    "prerequisites": [adv_topics[0] if adv_topics else "Advanced Skills"],
                                    "next_skill": "Apply for jobs!"
                                }
                            ]
                        }
                    ]
                }
            ],
            "interview_preparation": {
                "technical_topics": [s for s in req_skills[:4]] if req_skills else [f"Core {target_career} Concepts", "Tool Usage", "Best Practices"],
                "coding_topics": [f"Scenario-based {target_career} problems", "Case study walkthroughs"],
                "sql_dbms_questions": ["Data-driven decision making", "Key metrics in the field"],
                "hr_prep": [
                    f"Walk me through a project where you used {req_skills[0] if req_skills else target_career} skills.",
                    f"Why do you want to become a {target_career}?",
                    "Describe a challenge you faced and how you overcame it.",
                    f"How do you stay updated with trends in {domain}?"
                ]
            }
        }

    # Unused legacy method required for contract
    async def analyze_resume(self, resume_text: str, profile_context: Dict[str, Any] = None) -> Dict[str, Any]:
        return self._fallback_mode1([])


ai_service = AIService()
