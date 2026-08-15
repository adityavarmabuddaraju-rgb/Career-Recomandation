from pydantic import BaseModel
from datetime import datetime

class ResumeResponse(BaseModel):
    id: str
    user_id: str
    file_name: str
    uploaded_at: datetime
    has_analysis: bool
