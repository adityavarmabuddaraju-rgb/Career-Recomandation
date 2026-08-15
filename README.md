# 🎯 CareerAI — AI Career Recommendation Platform

<div align="center">

![CareerAI Banner](https://img.shields.io/badge/CareerAI-AI%20Powered%20Career%20Guidance-6366f1?style=for-the-badge&logo=sparkles&logoColor=white)

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)

**Discover careers based on your skills. Build your personalized learning roadmap. Land your dream job.**

[🚀 Live Demo](#) · [📖 Documentation](#getting-started) · [🐛 Report Bug](https://github.com/adityavarmabuddaraju-rgb/Career-Recomandation/issues)

</div>

---

## ✨ What is CareerAI?

CareerAI answers two of the most important career questions:

> **"What careers am I eligible for based on my skills?"**
> **"What do I need to learn to get the career I want?"**

It maps your current skills to real career paths across **10 domains and 155+ careers**, then builds you a personalized step-by-step learning roadmap — no resume upload needed.

---

## 🖥️ Screenshots

| Career Explorer | Career Roadmap | My Skills |
|---|---|---|
| Browse 155+ careers | Step-by-step roadmap | Track your skills |

---

## 🚀 Key Features

### 🔍 Career Discovery — *"What am I eligible for?"*
- Enter your current skills and background
- AI matches you to the most relevant careers across all domains
- See what skills you already have vs. what you're missing
- Get a prioritized list of careers with fit indicators

### 🗺️ Career Roadmap — *"I want this career"*
- Pick any career from the database
- Get a personalized 4-level week-by-week learning roadmap
- Roadmap adapts to your experience level and available hours per day
- Includes tools to learn, certifications to target, and interview prep

### 🗂️ Career Explorer
- Browse **155+ careers** across **10 professional domains**
- Filter by category, beginner-friendliness, and entry-level availability
- Search by career name or skill
- Full career detail pages with responsibilities, tools, and industries

### 📊 Skills Manager
- Add and manage your skills with proficiency levels
- Track Beginner / Intermediate / Advanced levels
- Skills inform AI recommendations automatically

### 💾 Saved Careers
- Bookmark careers you're interested in
- Quickly access roadmaps for saved careers

### ⚖️ Career Comparison
- Compare two careers side-by-side
- See skills overlap, tools, salaries, and difficulty

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Backend** | FastAPI (Python) |
| **Database** | MongoDB (Atlas) |
| **AI** | Google Gemini API |
| **Auth** | JWT (JSON Web Tokens) |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```
career-ai/
├── backend/                    # FastAPI Python backend
│   ├── app/
│   │   ├── api/                # Route handlers
│   │   │   ├── auth.py         # Authentication endpoints
│   │   │   ├── career.py       # Career discovery & roadmap
│   │   │   └── profile.py      # Skills & saved careers
│   │   ├── data/
│   │   │   └── career_database.py  # 155+ career dataset
│   │   ├── services/
│   │   │   └── ai_service.py   # Gemini AI integration
│   │   ├── auth/               # JWT & password utilities
│   │   ├── models/             # MongoDB models
│   │   ├── config.py           # Environment config
│   │   ├── database.py         # MongoDB connection
│   │   └── main.py             # FastAPI app entry point
│   └── requirements.txt
│
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── pages/              # All page components
│   │   │   ├── CareerDiscoveryPage.jsx   # AI career finder
│   │   │   ├── CareerExplorerPage.jsx    # Browse all careers
│   │   │   ├── CareerDetailPage.jsx      # Career details & roadmap
│   │   │   ├── CompareCareerPage.jsx     # Career comparison
│   │   │   ├── MySkillsPage.jsx          # Manage your skills
│   │   │   ├── MyCareersPage.jsx         # Saved careers
│   │   │   ├── DashboardPage.jsx         # Main dashboard
│   │   │   └── LandingPage.jsx           # Landing page
│   │   ├── services/           # API service layer
│   │   ├── context/            # React context (Auth, Toast)
│   │   ├── layouts/            # Layout components
│   │   └── components/         # Reusable UI components
│   └── package.json
│
├── .env.example                # Environment variables template
├── docker-compose.yml          # Docker setup
└── README.md
```

---

## 🌐 Career Domains Covered

| Domain | Example Careers |
|---|---|
| 💻 Technology & Software | Software Engineer, ML Engineer, DevOps, Cloud Architect |
| 🎨 Design & Creative | UI/UX Designer, Graphic Designer, Motion Designer |
| 📊 Business & Management | Product Manager, Business Analyst, Entrepreneur |
| 📣 Marketing & Media | Digital Marketing, SEO, Content Strategist |
| 💰 Finance & Accounting | Financial Analyst, Investment Banker, Actuary |
| 🏥 Healthcare & Life Sciences | Doctor, Nurse, Biomedical Engineer, Clinical Researcher |
| 🎓 Education & Research | Teacher, Professor, Instructional Designer |
| ⚙️ Engineering | Civil, Mechanical, Aerospace, Robotics Engineer |
| 🏛️ Government & Public Sector | Civil Services Officer, Policy Analyst |
| ⚖️ Law & Professional Services | Lawyer, Compliance Analyst, Paralegal |

---

## ⚡ Getting Started

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **MongoDB** (local or Atlas cloud)
- **Google Gemini API Key** (free at [aistudio.google.com](https://aistudio.google.com))

---

### 1. Clone the Repository

```bash
git clone https://github.com/adityavarmabuddaraju-rgb/Career-Recomandation.git
cd Career-Recomandation
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env
```

Edit `backend/.env` and fill in your values:
```env
MONGODB_URL=mongodb+srv://your-cluster-url
DATABASE_NAME=career_ai
GEMINI_API_KEY=your-gemini-api-key
SECRET_KEY=your-super-secret-jwt-key
```

Start the backend:
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend runs at: `http://localhost:8000`
API Docs at: `http://localhost:8000/docs`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# (or on Windows PowerShell: npm.cmd run dev)
```

Frontend runs at: `http://localhost:5173`

---

### 4. Open the App

Navigate to **[http://localhost:5173](http://localhost:5173)**, create an account, and start exploring!

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Login and get JWT token |
| `GET` | `/api/career/database` | Get all 155+ careers |
| `GET` | `/api/career/categories` | Get all career categories |
| `GET` | `/api/career/{slug}` | Get career details |
| `POST` | `/api/career/discover` | AI career discovery (Mode 1) |
| `POST` | `/api/career/target` | AI career roadmap (Mode 2) |
| `POST` | `/api/career/compare` | Compare two careers |
| `GET` | `/api/profile/my-skills` | Get user's skills |
| `POST` | `/api/profile/my-skills` | Add a skill |
| `GET` | `/api/profile/saved-careers` | Get saved careers |
| `POST` | `/api/profile/saved-careers` | Save a career |

---

## 🐳 Docker Setup (Optional)

Run everything with a single command:

```bash
docker-compose up --build
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👤 Author

**Aditya Varma Buddaraju**

[![GitHub](https://img.shields.io/badge/GitHub-adityavarmabuddaraju--rgb-181717?style=flat-square&logo=github)](https://github.com/adityavarmabuddaraju-rgb)

---

<div align="center">
  Made with ❤️ by Aditya Varma Buddaraju
  <br/>
  <i>CareerAI — Discover. Learn. Grow.</i>
</div>
