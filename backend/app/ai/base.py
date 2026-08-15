from abc import ABC, abstractmethod

class AIProvider(ABC):
    """Abstract base class for AI providers."""
    
    @abstractmethod
    async def analyze_resume(self, resume_text: str) -> dict:
        """
        Analyze the given resume text and return structured analysis data.
        
        Args:
            resume_text: The extracted text from the resume.
            
        Returns:
            Dictionary containing structured analysis.
        """
        pass
