"""
Resume Parser Service - Handles resume parsing with AI
"""
from .llm_service import llm_service
from .prompts import RESUME_PARSE_PROMPT, NATURAL_LANGUAGE_PROMPTS


class ResumeParserService:
    """Service for parsing resumes using AI"""
    
    def __init__(self):
        self.llm = llm_service
    
    def parse_resume(self, resume_text: str) -> dict | None:
        """
        Parse resume text and extract structured data using AI
        
        Args:
            resume_text: Extracted text from resume file
            
        Returns:
            Dictionary with parsed resume data or None if failed
        """
        # Limit text for API
        text_sample = resume_text[:6000] if len(resume_text) > 6000 else resume_text
        prompt = RESUME_PARSE_PROMPT.format(text_sample=text_sample)
        
        try:
            print("[DEBUG] Calling LLM for resume parsing...")
            result = self.llm.call(prompt)
            
            if not result:
                print("[ERROR] LLM returned no result")
                return None
            
            print(f"[DEBUG] LLM result length: {len(result)}")
            
            parsed = self.llm.parse_json_response(result)
            
            if parsed:
                print("[DEBUG] JSON parsing successful")
                self._log_extraction_stats(parsed)
                return parsed
            else:
                print("[ERROR] Failed to parse JSON response")
                return None
                
        except Exception as e:
            print(f"[ERROR] Exception in parse_resume: {e}")
            return None
    
    def _log_extraction_stats(self, parsed: dict) -> None:
        """Log extraction statistics for debugging"""
        print(f"[DEBUG] Extracted qualifications: {len(parsed.get('qualifications', []))}")
        print(f"[DEBUG] Extracted internships: {len(parsed.get('internships', []))}")
        print(f"[DEBUG] Extracted projects: {len(parsed.get('projects', []))}")
        print(f"[DEBUG] Extracted certifications: {len(parsed.get('certifications', []))}")
    
    def format_natural_language(self, section_type: str, user_input: str) -> dict | None:
        """
        Format natural language input into structured resume format
        
        Args:
            section_type: Type of section (project, experience, certification, skill)
            user_input: User's natural language description
            
        Returns:
            Formatted dictionary or None
        """
        prompt_template = NATURAL_LANGUAGE_PROMPTS.get(
            section_type,
            """Format this for a professional resume:

{}

Return the formatted text that would be appropriate for a resume."""
        )
        
        prompt = prompt_template.format(user_input)
        result = self.llm.call(prompt)
        
        if result:
            parsed = self.llm.parse_json_response(result)
            if parsed:
                return parsed
            return {"formatted_text": result}
        return None


# Singleton instance
resume_parser = ResumeParserService()
