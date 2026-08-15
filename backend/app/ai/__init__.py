from app.ai.base import AIProvider
from app.ai.gemini import GeminiProvider
from app.ai.mock import MockAIProvider
from app.config import settings

def get_ai_provider(provider_name: str = None) -> AIProvider:
    """Factory to get the AI provider."""
    name = provider_name or settings.AI_PROVIDER
    if name.lower() == 'gemini':
        return GeminiProvider()
    return MockAIProvider()
