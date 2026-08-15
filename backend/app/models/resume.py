from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class Resume(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    user_id: str
    file_name: str
    file_path: str
    extracted_text: str
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {
        "populate_by_name": True
    }
