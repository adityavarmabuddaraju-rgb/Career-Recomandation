import json
import logging
import google.generativeai as genai
from app.config import settings
from app.ai.base import AIProvider
from app.ai.prompts import RESUME_ANALYSIS_PROMPT
from app.ai.mock import MockAIProvider

logger = logging.getLogger(__name__)

class GeminiProvider(AIProvider):
    """Gemini implementation of the AIProvider."""
    
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            logger.warning("GEMINI_API_KEY not set. Will fallback to mock.")
            self.model = None

    async def analyze_resume(self, resume_text: str) -> dict:
        if not self.model:
            logger.warning("Falling back to Mock AI due to missing API key")
            return await MockAIProvider().analyze_resume(resume_text)

        prompt = RESUME_ANALYSIS_PROMPT.format(resume_text=resume_text)
        
        try:
            # We use generate_content in a sync way wrapped in async, or use genai async support if available.
            # python-google-generativeai supports async generation via generate_content_async
            response = await self.model.generate_content_async(prompt)
            
            # Extract JSON from response
            text = response.text
            # Remove possible markdown formatting if the model disobeys
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
                
            data = json.loads(text.strip())
            return data
            
        except Exception as e:
            logger.error(f"Error calling Gemini API: {e}")
            logger.info("Falling back to mock data.")
            return await MockAIProvider().analyze_resume(resume_text)
