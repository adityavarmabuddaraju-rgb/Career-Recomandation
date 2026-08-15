# 🚀 CareerAI — AI Resume Analyzer & Career Recommendation Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38BDF8.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248.svg)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-4285F4.svg)](https://deepmind.google/technologies/gemini/)

**CareerAI** is a state-of-the-art AI-powered platform designed to analyze resumes, optimize job targeting, evaluate skill gaps, generate tailored interview preparation material, and suggest actionable career pathways using Advanced AI Models (Google Gemini & Mock AI engine).

---

## 📸 Screenshots & Preview

> *Placeholder: Add application screenshots here*

| Dashboard View | Resume Analyzer | Skill Gap Analysis |
| :---: | :---: | :---: |
| ![Dashboard](https://via.placeholder.com/400x225?text=Dashboard+Overview) | ![Analyzer](https://via.placeholder.com/400x225?text=Resume+Analysis) | ![Skill Gap](https://via.placeholder.com/400x225?text=Skill+Gap+Chart) |

---

## ✨ Features

- 📄 **Smart Resume Parsing**: Extracts structured data (contact info, work history, education, skills, certifications) from PDF and DOCX files.
- 🎯 **AI Match Scoring & Analysis**: Calculates job match percentages based on target job descriptions and highlights keyword matches.
- 📊 **Skill Gap & Salary Insights**: Identifies missing critical skills, suggests learning roadmaps, and estimates market salary ranges.
- ✍️ **Interactive Resume Builder**: Drag-and-drop sections, real-time live preview, multiple modern templates, and export to PDF/JSON.
- 🛡️ **ATS Optimization Audit**: Checks formatting, keyword density, section header clarity, and readability for Applicant Tracking Systems.
- 💬 **AI Interview Prep Generator**: Generates customized technical and behavioral interview questions with suggested STAR answers based on your resume and target role.
- 🗺️ **Career Path Explorer**: Maps potential career growth trajectories, next-level roles, and skill upgrade paths.
- 👤 **User Dashboard & History**: Save, compare, and re-evaluate past resume analyses over time with persistent JWT authentication.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Framer Motion, Axios, React Router v6
- **Backend**: Python 3.12, FastAPI, Pydantic, Motor (Async MongoDB Driver), PyJWT, PyPDF2/python-docx
- **Database**: MongoDB 7.0
- **AI Integration**: Google Gemini 1.5 Flash API (with robust Mock AI fallback option)
- **Containerization**: Docker & Docker Compose

---

## 🏗️ Architecture Overview

```
 ┌────────────────┐       HTTP / REST       ┌────────────────┐
 │                │ ──────────────────────> │                │
 │  React Frontend│                         │ FastAPI Backend│
 │  (Vite + Tailwind)                      │ (Python 3.12)  │
 │                │ <────────────────────── │                │
 └────────────────┘                         └───────┬────────┘
                                                    │
                                  ┌─────────────────┴────────────────┐
                                  ▼                                  ▼
                        ┌──────────────────┐               ┌──────────────────┐
                        │   MongoDB DB     │               │  Google Gemini / │
                        │  (Motor Async)   │               │  Mock AI Service │
                        └──────────────────┘               └──────────────────┘
```

---

## 📋 Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Python**: 3.10 or higher
- **MongoDB**: Community Server running on `localhost:27017` or Docker container

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/career-ai.git
cd career-ai
```

### 2. Backend Setup
```bash
cd backend

# Copy environment variables template
cp ../.env.example .env

# Create virtual environment (optional but recommended)
python -m venv venv
# On Windows: venv\Scripts\activate
# On macOS/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn app.main:app --reload --port 8000
```
Backend API will be accessible at: `http://localhost:8000` (Docs: `http://localhost:8000/docs`).

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend Web App will be accessible at: `http://localhost:5173`.

### 4. MongoDB Database
Ensure MongoDB is running locally on default port `27017`:
```bash
mongod --dbpath /your/data/path
```
Or start via Docker:
```bash
docker run -d -p 27017:27017 --name careerai-mongo mongo:7
```

### 5. AI Configuration (Gemini or Demo Mode)
By default, `AI_PROVIDER=mock` is set in `.env` so you can test all features without API keys.
To enable real AI analysis with Google Gemini:
1. Get an API key from [Google AI Studio](https://aistudio.google.com/).
2. In `.env`, set:
   ```env
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your_actual_gemini_api_key
   ```

---

## 🐳 Docker Deployment

Run the entire application (Frontend + Backend + MongoDB) using Docker Compose:

```bash
# Start all containers
docker-compose up -d --build

# View container logs
docker-compose logs -f

# Stop containers
docker-compose down
```

---

## 🔑 Environment Variables

| Variable | Description | Default Value |
| :--- | :--- | :--- |
| `MONGODB_URL` | MongoDB connection URI | `mongodb://localhost:27017` |
| `DB_NAME` | Database name | `careerai` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your-super-secret-key-change-this` |
| `JWT_ALGORITHM` | Encryption algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token lifespan in minutes | `60` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token lifespan in days | `7` |
| `AI_PROVIDER` | AI Engine (`gemini` or `mock`) | `mock` |
| `GEMINI_API_KEY` | Google Gemini API Key | `your-gemini-api-key` |
| `UPLOAD_DIR` | File upload storage directory | `uploads` |
| `MAX_FILE_SIZE` | Maximum file upload size in bytes | `10485760` (10 MB) |
| `CORS_ORIGINS` | Permitted frontend origins (JSON array) | `["http://localhost:5173"]` |

---

## 🔌 API Endpoints Summary

### Auth Routes (`/api/auth`)
- `POST /api/auth/register` — Create a new user account
- `POST /api/auth/login` — Authenticate user and receive JWT tokens
- `GET /api/auth/me` — Retrieve current authenticated user profile

### Resume & Analysis Routes (`/api/resume`)
- `POST /api/resume/upload` — Upload and parse resume file (PDF/DOCX)
- `POST /api/resume/analyze` — Run AI analysis against job description
- `GET /api/resume/history` — Get past analysis records for user
- `GET /api/resume/{id}` — Get single analysis report details

### Career & Tools Routes (`/api/career`)
- `POST /api/career/interview-prep` — Generate tailored interview questions & STAR answers
- `POST /api/career/pathway` — Get career trajectory and roadmap suggestions
- `POST /api/career/ats-check` — Perform ATS compliance audit

---

## 📁 Project Structure

```
career-ai/
├── .env.example
├── .gitignore
├── docker-compose.yml
├── README.md
├── backend/
│   ├── app/
│   │   ├── api/          # Route handlers & endpoints
│   │   ├── core/         # Config, Security, DB connection
│   │   ├── models/       # Pydantic models & Schemas
│   │   ├── services/     # AI service, Parser, Matcher
│   │   └── main.py       # FastAPI application entry point
│   ├── uploads/          # Uploaded resume files
│   ├── Dockerfile
│   └── requirements.txt
└── frontend/
    ├── public/
    │   └── vite.svg
    ├── src/
    │   ├── components/   # UI & Shared components
    │   ├── context/      # React Auth Context
    │   ├── pages/        # Dashboard, Analyzer, Builder pages
    │   ├── services/     # Axios API service clients
    │   ├── App.jsx       # Main App & Router
    │   └── main.jsx      # Vite Client entry
    ├── Dockerfile
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the project repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
