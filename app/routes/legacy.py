"""
Legacy Routes - Backward compatibility for old URL patterns
Registers routes without /api prefix for backward compatibility
"""
from flask import request, send_from_directory, current_app
from .api import (
    upload_photo, 
    format_section, 
    get_suggestions, 
    parse_resume,
    format_natural_language,
    generate_pdf,
    generate_career_objective,
    generate_planned_skills,
    photo_upload_alias,
    career_objective_alias,
    planned_skills_suggestions_alias
)


def register_legacy_routes(app):
    """
    Register legacy routes directly on the app for backward compatibility.
    These routes existed before the /api prefix was added.
    """
    
    # Photo upload - multiple variations
    @app.route('/upload_photo', methods=['POST'])
    def legacy_upload_photo():
        return upload_photo()
    
    @app.route('/photo/upload', methods=['POST'])
    def legacy_photo_upload():
        return photo_upload_alias()
    
    @app.route('/photo-upload', methods=['POST'])
    def legacy_photo_upload_hyphen():
        return photo_upload_alias()
    
    @app.route('/photo_upload', methods=['POST'])
    def legacy_photo_upload_underscore():
        return photo_upload_alias()
    
    # Section formatting - multiple variations
    @app.route('/format_section', methods=['POST'])
    def legacy_format_section():
        return format_section()
    
    @app.route('/format/section', methods=['POST'])
    def legacy_format_section_slash():
        return format_section()
    
    @app.route('/format-section', methods=['POST'])
    def legacy_format_section_hyphen():
        return format_section()
    
    # AI suggestions
    @app.route('/get_suggestions', methods=['POST'])
    def legacy_get_suggestions():
        return get_suggestions()
    
    @app.route('/suggestions', methods=['POST'])
    def legacy_suggestions():
        return get_suggestions()
    
    # Resume parsing
    @app.route('/parse_resume', methods=['POST'])
    def legacy_parse_resume():
        return parse_resume()
    
    @app.route('/parse-resume', methods=['POST'])
    def legacy_parse_resume_hyphen():
        return parse_resume()
    
    @app.route('/resume/parse', methods=['POST'])
    def legacy_resume_parse():
        return parse_resume()
    
    # Natural language formatting
    @app.route('/format_natural_language', methods=['POST'])
    def legacy_format_natural_language():
        return format_natural_language()
    
    # PDF generation - multiple variations
    @app.route('/generate_pdf', methods=['POST'])
    def legacy_generate_pdf():
        return generate_pdf()
    
    @app.route('/generate-pdf', methods=['POST'])
    def legacy_generate_pdf_hyphen():
        return generate_pdf()
    
    @app.route('/pdf/generate', methods=['POST'])
    def legacy_pdf_generate():
        return generate_pdf()
    
    # Career objective generation - multiple variations
    @app.route('/generate_career_objective', methods=['POST'])
    def legacy_generate_career_objective():
        return generate_career_objective()
    
    @app.route('/generate-career-objective', methods=['POST'])
    def legacy_generate_career_objective_hyphen():
        return career_objective_alias()
    
    @app.route('/career-objective', methods=['POST'])
    def legacy_career_objective():
        return career_objective_alias()
    
    @app.route('/career_objective', methods=['POST'])
    def legacy_career_objective_underscore():
        return career_objective_alias()
    
    # Planned skills generation - multiple variations
    @app.route('/generate_planned_skills', methods=['POST'])
    def legacy_generate_planned_skills():
        return generate_planned_skills()
    
    @app.route('/generate-planned-skills', methods=['POST'])
    def legacy_generate_planned_skills_hyphen():
        return planned_skills_suggestions_alias()
    
    @app.route('/planned-skills', methods=['POST'])
    def legacy_planned_skills():
        return planned_skills_suggestions_alias()
    
    @app.route('/planned_skills', methods=['POST'])
    def legacy_planned_skills_underscore():
        return planned_skills_suggestions_alias()
    
    @app.route('/planned-skills/suggestions', methods=['POST'])
    def legacy_planned_skills_suggestions():
        return planned_skills_suggestions_alias()
    
    # Serve uploaded files
    @app.route('/uploads/<filename>')
    def serve_upload(filename):
        return send_from_directory(
            current_app.config['UPLOAD_FOLDER'], 
            filename
        )
