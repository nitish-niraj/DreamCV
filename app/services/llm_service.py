"""
LLM Service - Handles all AI/LLM interactions
"""
import requests
import json
import re
from ..config import Config


class LLMService:
    """Service for interacting with OpenRouter LLM API"""
    
    SYSTEM_PROMPT = """You are a professional CV formatting assistant specializing in creating DREAM CVs for students. 
Your task is to take raw user input and format it professionally for a CV.
Always maintain a professional tone and improve the language while keeping the original meaning.
Format the content to be concise, impactful, and suitable for a 2-page CV.
Return the response as a JSON object with properly formatted sections."""
    
    def __init__(self):
        self.api_key = Config.OPENROUTER_API_KEY
        self.base_url = Config.OPENROUTER_BASE_URL
        self.model = Config.MODEL_NAME
        self.temperature = Config.LLM_TEMPERATURE
        self.max_tokens = Config.LLM_MAX_TOKENS
        self.timeout = Config.LLM_TIMEOUT
    
    def call(self, prompt: str, system_prompt: str = None) -> str | None:
        """
        Call the OpenRouter LLM API
        
        Args:
            prompt: User prompt to send to the LLM
            system_prompt: Optional custom system prompt
            
        Returns:
            LLM response text or None if failed
        """
        if not self.api_key:
            print("[ERROR] OPENROUTER_API_KEY not set")
            return None
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5000",
            "X-Title": "DREAM CV Generator"
        }
        
        data = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt or self.SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": self.temperature,
            "max_tokens": self.max_tokens
        }
        
        try:
            print(f"[DEBUG] Calling OpenRouter API with model: {self.model}")
            response = requests.post(
                self.base_url,
                headers=headers,
                json=data,
                timeout=self.timeout
            )
            print(f"[DEBUG] API Response Status: {response.status_code}")
            response.raise_for_status()
            result = response.json()
            print("[DEBUG] OpenRouter API response received successfully")
            return result['choices'][0]['message']['content']
            
        except requests.exceptions.RequestException as e:
            print(f"[ERROR] OpenRouter API Error: {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"[ERROR] Response status: {e.response.status_code}")
                print(f"[ERROR] Response content: {e.response.text}")
            return None
    
    def format_section(self, section_name: str, content: str) -> str:
        """
        Format a CV section using LLM
        
        Args:
            section_name: Name of the section
            content: Raw content to format
            
        Returns:
            Formatted content
        """
        prompt = f"""Format the following {section_name} section for a professional DREAM CV.
Make it concise, professional, and impactful.

Raw Content:
{content}

Return ONLY the formatted text, no explanations. Keep it brief and professional."""
        
        result = self.call(prompt)
        return result if result else content
    
    def generate_suggestions(self, cv_data: dict) -> str:
        """
        Generate AI suggestions for improving the CV
        
        Args:
            cv_data: Dictionary containing CV data
            
        Returns:
            Suggestions text
        """
        prompt = f"""Analyze this DREAM CV data and provide 3-5 brief suggestions for improvement:

Dream Company: {cv_data.get('dream_company', '')}
Target Role: {cv_data.get('target_role', '')}
Target Technology: {cv_data.get('target_technology', '')}
Skills: {cv_data.get('technical_skills', '')}
Projects: {cv_data.get('projects', '')}

Provide brief, actionable suggestions to make this CV stronger for the target company. 
Return as a simple numbered list."""
        
        result = self.call(prompt)
        return result if result else "Unable to generate suggestions at this time."
    
    def generate_career_objective(self, data: dict) -> dict:
        """
        Generate a professional career objective paragraph using AI
        Blends 50% dream company details + 50% resume content
        
        Args:
            data: Dictionary containing CV data for context
            
        Returns:
            Dictionary with 'success' status and 'career_objective' text
        """
        from .prompts import NATURAL_LANGUAGE_PROMPTS
        
        # Extract relevant fields for the prompt
        name = data.get('name', 'the candidate')
        dream_company = data.get('dream_company', 'a leading tech company')
        target_role = data.get('target_role', 'a technical role')
        target_technology = data.get('target_technology', '')
        cohort = data.get('cohort', '')
        
        # Extract resume-based information
        technical_skills = data.get('technical_skills', '')
        work_experience = data.get('work_experience', '')
        projects = data.get('projects', '')
        education = data.get('education', '')
        achievements = data.get('achievements', '')
        
        # Determine experience level
        experience_level = 'Fresher'
        if work_experience and len(work_experience) > 50:
            experience_level = 'Experienced Professional'
        elif projects or technical_skills:
            experience_level = 'Fresh Graduate with Project Experience'
        
        # Use the career_objective prompt template
        prompt = NATURAL_LANGUAGE_PROMPTS['career_objective'].format(
            name=name,
            dream_company=dream_company,
            target_role=target_role,
            target_technology=target_technology,
            cohort=cohort,
            skills=technical_skills[:500] if technical_skills else 'Not specified',
            education=education[:300] if education else 'Not specified',
            experience_level=experience_level,
            projects=projects[:400] if projects else 'Not specified',
            achievements=achievements[:200] if achievements else 'Not specified'
        )
        
        system_prompt = """You are an expert DREAM CV Career Objective writer for college students.

Your task is to create a career objective that:
1. Is exactly 2-3 lines (50-80 words maximum)
2. Follows the formula: Aspiring [Role] + [Education] + [Skills] + [Dream Company/Cohort] + [Value]
3. Is SPECIFIC to the dream company and role mentioned
4. Uses actual relevant skills from the candidate's resume
5. Is future-focused (aspiring, aiming, targeting)

NEVER use generic phrases like:
- "seeking opportunities"
- "hardworking and dedicated"  
- "team player"
- "I am" or "I want"

Write concisely and specifically for the DREAM CV format."""
        
        result = self.call(prompt, system_prompt)
        
        if result:
            # Try to parse as JSON first
            parsed = self.parse_json_response(result)
            if parsed and 'career_objective' in parsed:
                return {
                    'success': True,
                    'career_objective': parsed['career_objective']
                }
            
            # Clean up the response - remove any quotes or extra formatting
            career_objective = result.strip()
            # Remove leading/trailing quotes if present
            if career_objective.startswith('"') and career_objective.endswith('"'):
                career_objective = career_objective[1:-1]
            if career_objective.startswith("'") and career_objective.endswith("'"):
                career_objective = career_objective[1:-1]
            
            return {
                'success': True,
                'career_objective': career_objective
            }
        else:
            return {
                'success': False,
                'error': 'Failed to generate career objective. Please try again.'
            }
    
    def clean_json_response(self, response: str) -> str:
        """
        Clean LLM response to extract valid JSON
        
        Args:
            response: Raw LLM response
            
        Returns:
            Cleaned JSON string
        """
        cleaned = response.strip()
        if cleaned.startswith('```'):
            cleaned = re.sub(r'^```(?:json)?\s*', '', cleaned)
            cleaned = re.sub(r'\s*```$', '', cleaned)
        return cleaned
    
    def repair_truncated_json(self, json_str: str) -> str:
        """
        Attempt to repair truncated JSON by closing open brackets/braces
        
        Args:
            json_str: Potentially truncated JSON string
            
        Returns:
            Repaired JSON string
        """
        # Count open brackets and braces
        open_braces = json_str.count('{') - json_str.count('}')
        open_brackets = json_str.count('[') - json_str.count(']')
        
        # Check for unterminated strings (odd number of unescaped quotes)
        in_string = False
        last_char = ''
        for char in json_str:
            if char == '"' and last_char != '\\':
                in_string = not in_string
            last_char = char
        
        repaired = json_str
        
        # If we're inside a string, close it
        if in_string:
            # Find a good place to cut - look for the last complete field
            # Try to cut at last comma or colon that's not in a string
            repaired = repaired.rstrip()
            if repaired.endswith(','):
                repaired = repaired[:-1]
            elif not repaired.endswith(('"', ']', '}')):
                # Truncated mid-value, try to close the string
                repaired += '"'
        
        # Close any open brackets first (arrays inside objects)
        for _ in range(open_brackets):
            repaired += ']'
        
        # Then close any open braces
        for _ in range(open_braces):
            repaired += '}'
        
        return repaired
    
    def parse_json_response(self, response: str) -> dict | None:
        """
        Parse JSON from LLM response with repair for truncated responses
        
        Args:
            response: LLM response text
            
        Returns:
            Parsed dictionary or None
        """
        try:
            cleaned = self.clean_json_response(response)
            return json.loads(cleaned)
        except json.JSONDecodeError as e:
            print(f"[ERROR] JSON decode error: {e}")
            print("[DEBUG] Attempting to repair truncated JSON...")
            
            try:
                # Try to repair the JSON
                cleaned = self.clean_json_response(response)
                repaired = self.repair_truncated_json(cleaned)
                result = json.loads(repaired)
                print("[DEBUG] JSON repair successful!")
                return result
            except json.JSONDecodeError as e2:
                print(f"[ERROR] JSON repair failed: {e2}")
                
                # Last resort: try to extract what we can using regex
                return self.extract_partial_data(response)
    
    def extract_partial_data(self, response: str) -> dict | None:
        """
        Extract partial data from malformed JSON using regex
        
        Args:
            response: Malformed JSON response
            
        Returns:
            Dictionary with extracted data or None
        """
        print("[DEBUG] Attempting partial data extraction...")
        
        data = {}
        
        # Extract simple string fields
        simple_fields = [
            'full_name', 'email', 'phone', 'address', 'linkedin', 'github',
            'professional_summary', 'prog_languages', 'web_tech', 'databases',
            'mobile_tech', 'other_tools', 'leetcode', 'gfg', 'hackerrank',
            'portfolio', 'skype'
        ]
        
        for field in simple_fields:
            # Match "field": "value" or "field": 'value'
            pattern = rf'"{field}"\s*:\s*"([^"]*)"'
            match = re.search(pattern, response)
            if match:
                data[field] = match.group(1)
        
        # Try to extract arrays (qualifications, projects, etc.)
        array_fields = ['qualifications', 'internships', 'projects', 'certifications', 'experiences']
        
        for field in array_fields:
            # Find the start of the array
            pattern = rf'"{field}"\s*:\s*\['
            match = re.search(pattern, response)
            if match:
                start = match.end()
                # Find matching closing bracket or end of string
                bracket_count = 1
                end = start
                for i, char in enumerate(response[start:], start):
                    if char == '[':
                        bracket_count += 1
                    elif char == ']':
                        bracket_count -= 1
                        if bracket_count == 0:
                            end = i + 1
                            break
                    end = i + 1
                
                array_str = '[' + response[start:end]
                if not array_str.endswith(']'):
                    array_str = self.repair_truncated_json(array_str)
                
                try:
                    data[field] = json.loads(array_str)
                except:
                    data[field] = []
        
        if data:
            print(f"[DEBUG] Partial extraction got {len(data)} fields")
            return data
        
        return None
    
    def generate_planned_skills(self, dream_context: dict, current_skills: dict) -> dict:
        """
        Generate recommended skills and certifications to learn based on DREAM target
        
        Args:
            dream_context: Dictionary with cohort, dream_company, target_role, target_technology
            current_skills: Dictionary with current skill categories
            
        Returns:
            Dictionary with planned_skills, planned_certifications, learning_path
        """
        from .prompts import PLANNED_SKILLS_PROMPT
        
        prompt = PLANNED_SKILLS_PROMPT.format(
            cohort=dream_context.get('cohort', 'Not specified'),
            dream_company=dream_context.get('dream_company', 'Not specified'),
            target_role=dream_context.get('target_role', 'Not specified'),
            target_technology=dream_context.get('target_technology', 'Not specified'),
            current_languages=current_skills.get('prog_languages', 'Not specified'),
            current_web_tech=current_skills.get('web_tech', 'Not specified'),
            current_databases=current_skills.get('databases', 'Not specified'),
            current_mobile_tech=current_skills.get('mobile_tech', 'Not specified'),
            current_tools=current_skills.get('other_tools', 'Not specified')
        )
        
        system_prompt = """You are a career advisor specializing in technology career paths.
Your task is to recommend skills and certifications for candidates to achieve their DREAM career goals.
Be specific and practical. Consider what the target company actually values.
Return ONLY valid JSON with no additional text or explanation."""
        
        result = self.call(prompt, system_prompt)
        
        if result:
            parsed = self.parse_json_response(result)
            if parsed:
                return {
                    'success': True,
                    'planned_skills': parsed.get('planned_skills', {}),
                    'planned_certifications': parsed.get('planned_certifications', []),
                    'learning_path': parsed.get('learning_path', '')
                }
        
        # Return empty structure on failure
        return {
            'success': False,
            'error': 'Failed to generate planned skills',
            'planned_skills': {},
            'planned_certifications': [],
            'learning_path': ''
        }


# Singleton instance
llm_service = LLMService()
