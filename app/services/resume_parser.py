"""
Resume Parser Service - Handles resume parsing with AI
"""
from .llm_service import llm_service
from .prompts import RESUME_PARSE_PROMPT, RESUME_PARSE_PROMPT_WITH_CONTEXT, RESUME_PARSE_COMPACT_PROMPT, NATURAL_LANGUAGE_PROMPTS


class ResumeParserService:
    """Service for parsing resumes using AI"""
    
    def __init__(self):
        self.llm = llm_service
    
    def parse_resume(self, resume_text: str, dream_context: dict = None) -> dict | None:
        """
        Parse resume text and extract structured data using AI
        Optionally uses DREAM context to tailor the extraction
        
        Args:
            resume_text: Extracted text from resume file
            dream_context: Optional DREAM company context for tailored parsing
            
        Returns:
            Dictionary with parsed resume data or None if failed
        """
        # Limit text for API - reduce to prevent token overflow
        text_sample = resume_text[:4000] if len(resume_text) > 4000 else resume_text
        
        # Use context-aware prompt if DREAM context is provided
        if dream_context and (dream_context.get('cohort') or dream_context.get('dream_company')):
            prompt = RESUME_PARSE_PROMPT_WITH_CONTEXT.format(
                text_sample=text_sample,
                cohort=dream_context.get('cohort', 'Not specified'),
                dream_company=dream_context.get('dream_company', 'Not specified'),
                target_role=dream_context.get('target_role', 'Not specified'),
                target_technology=dream_context.get('target_technology', 'Not specified')
            )
            print(f"[DEBUG] Using DREAM context for parsing: {dream_context.get('dream_company')} - {dream_context.get('target_role')}")
        else:
            prompt = RESUME_PARSE_PROMPT.format(text_sample=text_sample)
            print("[DEBUG] Parsing without DREAM context")
        
        try:
            print("[DEBUG] Calling LLM for resume parsing...")
            result = self.llm.call(prompt)
            
            if not result:
                print("[ERROR] LLM returned no result")
                return self._try_compact_parsing(text_sample)
            
            print(f"[DEBUG] LLM result length: {len(result)}")
            
            parsed = self.llm.parse_json_response(result)
            
            if parsed:
                print("[DEBUG] JSON parsing successful")
                self._log_extraction_stats(parsed)
                return parsed
            else:
                print("[WARN] Main prompt failed, trying compact prompt...")
                return self._try_compact_parsing(text_sample)
                
        except Exception as e:
            print(f"[ERROR] Exception in parse_resume: {e}")
            return self._try_compact_parsing(text_sample)
    
    def _try_compact_parsing(self, text_sample: str) -> dict | None:
        """
        Try parsing with compact prompt as fallback
        
        Args:
            text_sample: Resume text to parse
            
        Returns:
            Parsed data or None
        """
        try:
            print("[DEBUG] Attempting compact parsing...")
            compact_prompt = RESUME_PARSE_COMPACT_PROMPT.format(text_sample=text_sample[:3000])
            result = self.llm.call(compact_prompt)
            
            if result:
                print(f"[DEBUG] Compact result length: {len(result)}")
                parsed = self.llm.parse_json_response(result)
                if parsed:
                    print("[DEBUG] Compact parsing successful!")
                    self._log_extraction_stats(parsed)
                    return parsed
            
            print("[ERROR] Compact parsing also failed")
            return None
            
        except Exception as e:
            print(f"[ERROR] Compact parsing exception: {e}")
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
