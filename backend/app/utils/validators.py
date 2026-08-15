import os
import re
from app.config import settings

def validate_file_type(filename: str) -> bool:
    """Validate if file is PDF or DOCX."""
    allowed_extensions = {'.pdf', '.doc', '.docx'}
    _, ext = os.path.splitext(filename)
    return ext.lower() in allowed_extensions

def validate_file_size(size: int) -> bool:
    """Validate if file size is under maximum."""
    return size <= settings.MAX_FILE_SIZE

def sanitize_filename(filename: str) -> str:
    """Clean filename to prevent path traversal and remove bad chars."""
    filename = os.path.basename(filename)
    # Remove all non-word characters except dot and dash
    filename = re.sub(r'[^\w\.-]', '_', filename)
    return filename
