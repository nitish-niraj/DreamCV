"""
PDF Service - Handles CV PDF generation using xhtml2pdf
"""
import os
import re
import base64
from io import BytesIO
from flask import render_template, current_app
from xhtml2pdf import pisa
from .styles import get_cv_styles


def sanitize_text(text):
    """
    Sanitize text to replace Unicode characters that xhtml2pdf can't render.
    This prevents square box (■) characters from appearing in PDFs.
    """
    if not isinstance(text, str):
        return text
    
    # Map of problematic Unicode characters to safe ASCII replacements
    replacements = {
        '\u2022': '-',   # Bullet •
        '\u2023': '-',   # Triangle bullet
        '\u2043': '-',   # Hyphen bullet
        '\u2219': '-',   # Bullet operator
        '\u25CF': '-',   # Black circle
        '\u25E6': '-',   # White bullet
        '\u25AA': '-',   # Black small square
        '\u25AB': '-',   # White small square
        '\u2013': '-',   # En dash
        '\u2014': '--',  # Em dash
        '\u2018': "'",   # Left single quote
        '\u2019': "'",   # Right single quote
        '\u201C': '"',   # Left double quote
        '\u201D': '"',   # Right double quote
        '\u2026': '...', # Ellipsis
        '\u00A0': ' ',   # Non-breaking space
        '\u200B': '',    # Zero-width space
        '\u200C': '',    # Zero-width non-joiner
        '\u200D': '',    # Zero-width joiner
        '\uFEFF': '',    # BOM
        '\u2212': '-',   # Minus sign
        '\u00B7': '-',   # Middle dot
        '\u2192': '->',  # Right arrow
        '\u2190': '<-',  # Left arrow
        '\u2794': '->',  # Heavy arrow
        '\u25B6': '>',   # Play button
        '\u25B8': '>',   # Small play button
        '\u2605': '*',   # Black star
        '\u2606': '*',   # White star
        '\u2713': '/',   # Check mark
        '\u2714': '/',   # Heavy check mark
        '\u2717': 'X',   # Ballot X
        '\u2718': 'X',   # Heavy ballot X
    }
    
    for unicode_char, replacement in replacements.items():
        text = text.replace(unicode_char, replacement)
    
    return text


def sanitize_data_recursive(data):
    """Recursively sanitize all string values in a dictionary or list."""
    if isinstance(data, str):
        return sanitize_text(data)
    elif isinstance(data, dict):
        return {key: sanitize_data_recursive(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [sanitize_data_recursive(item) for item in data]
    else:
        return data


def link_callback(uri, rel):
    """
    Convert file:// URIs to absolute paths for xhtml2pdf
    """
    if uri.startswith('file:///'):
        path = uri.replace('file:///', '')
        return path
    return uri


class PDFService:
    """Service for generating PDF CVs"""
    
    def __init__(self):
        self.styles = get_cv_styles()
    
    def generate(self, cv_data: dict) -> tuple[BytesIO, str] | tuple[None, str]:
        """
        Generate a PDF CV from CV data
        
        Args:
            cv_data: Dictionary containing all CV information
            
        Returns:
            Tuple of (BytesIO buffer, filename) or (None, error message)
        """
        try:
            # Preprocess data for template
            processed_data = self._preprocess_cv_data(cv_data)
            
            # Sanitize all text to remove problematic Unicode characters
            processed_data = sanitize_data_recursive(processed_data)
            
            # Render HTML template
            html_content = render_template(
                'cv_template.html',
                data=processed_data,
                cv_styles=self.styles
            )
            
            # Generate PDF with link_callback for image handling
            result_buffer = BytesIO()
            pisa_status = pisa.CreatePDF(
                src=BytesIO(html_content.encode('utf-8')),
                dest=result_buffer,
                encoding='utf-8',
                link_callback=link_callback
            )
            
            if pisa_status.err:
                print(f"[ERROR] PDF generation error: {pisa_status.err}")
                return None, "PDF generation failed"
            
            result_buffer.seek(0)
            
            # Generate filename
            name = cv_data.get('full_name', 'CV')
            safe_name = "".join(c for c in name if c.isalnum() or c in ' -_').strip()
            filename = f"{safe_name}_CV.pdf" if safe_name else "CV.pdf"
            
            return result_buffer, filename
            
        except Exception as e:
            print(f"[ERROR] PDF generation exception: {e}")
            import traceback
            traceback.print_exc()
            return None, str(e)
    
    def _preprocess_cv_data(self, cv_data: dict) -> dict:
        """
        Preprocess CV data for template rendering
        
        Handles:
        - Photo path conversion to base64 data URI
        - List fields that need to remain as arrays
        - Empty value handling
        - Data normalization
        - Dynamic skill category labels based on cohort
        """
        processed = cv_data.copy()
        
        # Add dynamic skill category labels based on cohort
        cohort = processed.get('cohort', '')
        skill_labels = self._get_skill_labels_for_cohort(cohort)
        processed['skill_labels'] = skill_labels
        
        # Handle photo - check if it's already a base64 data URL
        if 'photo_url' in processed and processed['photo_url']:
            photo_url = processed['photo_url']
            
            # Check if it's already a base64 data URL (from in-memory upload)
            if photo_url.startswith('data:image'):
                # Already base64 encoded, use directly
                processed['photo_data'] = photo_url
                print(f"[DEBUG] Using base64 photo data directly")
            elif photo_url.startswith('/uploads/'):
                # Legacy: file path - try to read from disk
                filename = photo_url.replace('/uploads/', '')
                upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
                abs_path = os.path.join(upload_folder, filename)
                
                print(f"[DEBUG] Looking for photo at: {abs_path}")
                
                if os.path.exists(abs_path):
                    try:
                        with open(abs_path, 'rb') as img_file:
                            img_data = img_file.read()
                            img_base64 = base64.b64encode(img_data).decode('utf-8')
                            
                            # Determine image type
                            ext = filename.lower().split('.')[-1]
                            mime_type = {
                                'jpg': 'image/jpeg',
                                'jpeg': 'image/jpeg',
                                'png': 'image/png',
                                'gif': 'image/gif'
                            }.get(ext, 'image/jpeg')
                            
                            processed['photo_data'] = f"data:{mime_type};base64,{img_base64}"
                            print(f"[DEBUG] Photo converted to base64 successfully")
                    except Exception as e:
                        print(f"[ERROR] Could not read photo file: {e}")
                else:
                    print(f"[DEBUG] Photo file not found at: {abs_path}")
            else:
                print(f"[DEBUG] Unknown photo URL format: {photo_url[:50]}...")
        
        # Ensure list fields are lists
        list_fields = [
            'qualifications', 'internships', 'certifications', 
            'projects', 'experiences', 'responsibilities', 'languages',
            'community_activities', 'achievements', 'tech_events', 'other_platforms'
        ]
        
        for field in list_fields:
            if field not in processed:
                processed[field] = []
            elif isinstance(processed[field], str):
                # Convert string to list (for backwards compatibility)
                if processed[field].strip():
                    processed[field] = [processed[field].strip()]
                else:
                    processed[field] = []
        
        # Process nested bullet points
        for field in ['internships', 'projects', 'experiences', 'responsibilities']:
            if field in processed and isinstance(processed[field], list):
                for item in processed[field]:
                    if isinstance(item, dict):
                        # Ensure bullets is a list
                        if 'bullets' in item and isinstance(item['bullets'], str):
                            item['bullets'] = [b.strip() for b in item['bullets'].split('\n') if b.strip()]
                        elif 'bullets' not in item:
                            item['bullets'] = []
        
        return processed
    
    def _get_skill_labels_for_cohort(self, cohort: str) -> dict:
        """
        Get dynamic skill category labels based on the selected cohort
        
        Args:
            cohort: The selected career cohort
            
        Returns:
            Dictionary with skill category labels
        """
        cohort_labels = {
            'Full Stack Developer (Web/Mobile)': {
                'cat1': 'Programming Languages',
                'cat2': 'Frontend Technologies',
                'cat3': 'Backend & Databases',
                'cat4': 'Mobile Development',
                'cat5': 'DevOps & Tools'
            },
            'AIML (Artificial Intelligence & Machine Learning)': {
                'cat1': 'Programming & ML Languages',
                'cat2': 'ML/DL Frameworks',
                'cat3': 'Data Processing & Databases',
                'cat4': 'AI/ML Tools & Platforms',
                'cat5': 'Specialized Skills'
            },
            'Data Analyst': {
                'cat1': 'Programming & Query Languages',
                'cat2': 'Visualization Tools',
                'cat3': 'Databases & Data Warehousing',
                'cat4': 'Data Processing',
                'cat5': 'Statistical & Analytics Tools'
            },
            'Cyber Security': {
                'cat1': 'Programming & Scripting',
                'cat2': 'Security Tools',
                'cat3': 'Network & System Security',
                'cat4': 'Security Frameworks',
                'cat5': 'Specialized Skills'
            },
            'Quality Assurance & Testing': {
                'cat1': 'Programming Languages',
                'cat2': 'Testing Frameworks',
                'cat3': 'API & Performance Testing',
                'cat4': 'CI/CD & DevOps',
                'cat5': 'Testing Methodologies'
            },
            'Game Development': {
                'cat1': 'Programming Languages',
                'cat2': 'Game Engines',
                'cat3': 'Graphics & Tools',
                'cat4': 'Game Development Skills',
                'cat5': 'Platforms & Deployment'
            }
        }
        
        # Default labels
        default_labels = {
            'cat1': 'Programming Languages',
            'cat2': 'Web Technologies',
            'cat3': 'Databases',
            'cat4': 'Cloud/Mobile Technologies',
            'cat5': 'Tools and Platforms'
        }
        
        return cohort_labels.get(cohort, default_labels)
    
    def get_styles(self) -> str:
        """Get the CSS styles for CV generation"""
        return self.styles


# Singleton instance
pdf_service = PDFService()
