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
    generate_planned_skills
)


def register_legacy_routes(app):
    """
    Register legacy routes directly on the app for backward compatibility.
    These routes existed before the /api prefix was added.
    """
    
    # Photo upload
    @app.route('/upload_photo', methods=['POST'])
    def legacy_upload_photo():
        return upload_photo()
    
    # Section formatting
    @app.route('/format_section', methods=['POST'])
    def legacy_format_section():
        return format_section()
    
    # AI suggestions
    @app.route('/get_suggestions', methods=['POST'])
    def legacy_get_suggestions():
        return get_suggestions()
    
    # Resume parsing
    @app.route('/parse_resume', methods=['POST'])
    def legacy_parse_resume():
        return parse_resume()
    
    # Natural language formatting
    @app.route('/format_natural_language', methods=['POST'])
    def legacy_format_natural_language():
        return format_natural_language()
    
    # PDF generation
    @app.route('/generate_pdf', methods=['POST'])
    def legacy_generate_pdf():
        return generate_pdf()
    
    # Career objective generation
    @app.route('/generate_career_objective', methods=['POST'])
    def legacy_generate_career_objective():
        return generate_career_objective()
    
    # Planned skills generation
    @app.route('/generate_planned_skills', methods=['POST'])
    def legacy_generate_planned_skills():
        return generate_planned_skills()
    
    # Serve uploaded files
    @app.route('/uploads/<filename>')
    def serve_upload(filename):
        return send_from_directory(
            current_app.config['UPLOAD_FOLDER'], 
            filename
        )
