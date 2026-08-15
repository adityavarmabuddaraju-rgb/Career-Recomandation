import os
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from app.config import settings
from app.database import connect_db, close_db
from app.api import auth, resume, analysis, jobs, career, profile

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting CareerAI Application...")
    if settings.GEMINI_API_KEY:
        logger.info("GEMINI_API_KEY is configured.")
    else:
        logger.warning("GEMINI_API_KEY is not configured. Falling back to Mock AI.")

    await connect_db()
    yield
    logger.info("Shutting down CareerAI Application...")
    await close_db()

app = FastAPI(
    title="CareerAI — AI Career Roadmap & Skills Platform",
    description="Unified AI Career Guidance Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred."}
    )

# Include API Routers
app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(analysis.router)
app.include_router(jobs.router)
app.include_router(career.router)
app.include_router(profile.router)

@app.get("/api/health", tags=["health"])
async def health_check():
    return {
        "status": "ok",
        "ai_service": "configured" if settings.GEMINI_API_KEY else "mock"
    }

# Unified Frontend Integration
DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
ASSETS_DIR = os.path.join(DIST_DIR, "assets")

if os.path.exists(ASSETS_DIR):
    app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")

@app.get("/{full_path:path}", include_in_schema=False)
async def serve_react_app(request: Request, full_path: str):
    if full_path.startswith("api/"):
        return JSONResponse(status_code=404, content={"detail": "API endpoint not found"})
        
    requested_file = os.path.join(DIST_DIR, full_path)
    if os.path.exists(requested_file) and os.path.isfile(requested_file):
        return FileResponse(requested_file)
        
    index_html = os.path.join(DIST_DIR, "index.html")
    if os.path.exists(index_html):
        return FileResponse(index_html)
        
    return JSONResponse(status_code=404, content={"detail": "Frontend build not found."})
