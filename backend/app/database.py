import motor.motor_asyncio
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    """MongoDB database connection manager."""
    client: motor.motor_asyncio.AsyncIOMotorClient = None
    db = None

db = Database()

async def connect_db():
    """Connect to MongoDB."""
    try:
        db.client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URL)
        db.db = db.client[settings.DB_NAME]
        logger.info("Connected to MongoDB")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        # Allow system to run with fallback if Mongo is offline

async def close_db():
    """Close MongoDB connection."""
    if db.client:
        db.client.close()
        logger.info("Closed MongoDB connection")

def get_database():
    """Get database instance."""
    return db.db

def get_users_collection():
    """Get users collection."""
    return db.db['users'] if db.db is not None else None

def get_resumes_collection():
    """Get resumes collection."""
    return db.db['resumes'] if db.db is not None else None

def get_analyses_collection():
    """Get analyses collection."""
    return db.db['analyses'] if db.db is not None else None

def get_saved_jobs_collection():
    """Get saved_jobs collection."""
    return db.db['saved_jobs'] if db.db is not None else None

def get_saved_skills_collection():
    """Get saved_skills collection."""
    return db.db['saved_skills'] if db.db is not None else None

def get_saved_careers_collection():
    """Get saved_careers collection."""
    return db.db['saved_careers'] if db.db is not None else None

def get_user_skills_collection():
    return db.db['user_skills'] if db.db is not None else None

def get_user_saved_careers_collection():
    return db.db['user_saved_careers'] if db.db is not None else None

def get_user_profiles_collection():
    return db.db['user_profiles'] if db.db is not None else None

