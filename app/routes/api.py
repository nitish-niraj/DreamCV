"""
API Routes - API endpoints for CV operations
"""
import os
import uuid
import base64
from flask import Blueprint, request, jsonify, send_file, current_app
from werkzeug.utils import secure_filename

from ..services import llm_service, pdf_service, resume_parser
from ..utils.file_handlers import (
    allowed_file, 
    allowed_resume_file, 
    extract_text_from_file
)

api_bp = Blueprint('api', __name__)


@api_bp.route('/upload_photo', methods=['POST'])
def upload_photo():
    """Handle photo upload for CV - returns base64 encoded image for in-memory use"""
    if 'photo' not in request.files:
        return jsonify({'success': False, 'error': 'No photo uploaded'}), 400
    
    file = request.files['photo']
    
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({
            'success': False, 
            'error': 'Invalid file type. Use PNG, JPG, or JPEG'
        }), 400
    
    try:
        # Read file content into memory
        file_content = file.read()
        
        # Get MIME type based on extension
        filename = file.filename.lower()
        if filename.endswith('.png'):
            mime_type = 'image/png'
        elif filename.endswith('.gif'):
            mime_type = 'image/gif'
        else:
            mime_type = 'image/jpeg'
        
        # Convert to base64 data URL for in-memory use
        base64_data = base64.b64encode(file_content).decode('utf-8')
        data_url = f"data:{mime_type};base64,{base64_data}"
        
        return jsonify({
            'success': True, 
            'photo_url': data_url,
            'is_base64': True
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@api_bp.route('/format_section', methods=['POST'])
def format_section():
    """Format a CV section using AI"""
    data = request.json
    section = data.get('section', '')
    content = data.get('content', '')
    
    if not content:
        return jsonify({'success': False, 'error': 'No content provided'}), 400
    
    formatted = llm_service.format_section(section, content)
    return jsonify({'success': True, 'formatted': formatted})


@api_bp.route('/get_suggestions', methods=['POST'])
def get_suggestions():
    """Get AI suggestions for CV improvement"""
    cv_data = request.json
    
    if not cv_data:
        return jsonify({
            'success': False, 
            'error': 'No CV data provided'
        }), 400
    
    suggestions = llm_service.generate_suggestions(cv_data)
    return jsonify({'success': True, 'suggestions': suggestions})


@api_bp.route('/parse_resume', methods=['POST'])
def parse_resume():
    """Parse uploaded resume file using AI"""
    if 'resume' not in request.files:
        return jsonify({
            'success': False, 
            'error': 'No resume file uploaded'
        }), 400
    
    file = request.files['resume']
    
    if file.filename == '':
        return jsonify({
            'success': False, 
            'error': 'No file selected'
        }), 400
    
    if not allowed_resume_file(file.filename):
        return jsonify({
            'success': False,
            'error': 'Invalid file type. Use PDF, DOC, DOCX, or TXT'
        }), 400
    
    try:
        # Extract text from file
        text = extract_text_from_file(file)
        
        if not text or len(text.strip()) < 50:
            return jsonify({
                'success': False,
                'error': 'Could not extract enough text from the file'
            }), 400
        
        # Parse with AI
        parsed_data = resume_parser.parse_resume(text)
        
        if parsed_data:
            return jsonify({'success': True, 'data': parsed_data})
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to parse resume content'
            }), 500
            
    except Exception as e:
        print(f"[ERROR] Resume parsing error: {e}")
        return jsonify({
            'success': False,
            'error': f'Error processing file: {str(e)}'
        }), 500


@api_bp.route('/format_natural_language', methods=['POST'])
def format_natural_language():
    """Format natural language input into structured resume format"""
    data = request.json
    section_type = data.get('section_type', 'project')
    user_input = data.get('input', '')
    
    if not user_input:
        return jsonify({
            'success': False, 
            'error': 'No input provided'
        }), 400
    
    result = resume_parser.format_natural_language(section_type, user_input)
    
    if result:
        return jsonify({'success': True, 'data': result})
    else:
        return jsonify({
            'success': False,
            'error': 'Failed to format input'
        }), 500


@api_bp.route('/generate_pdf', methods=['POST'])
def generate_pdf():
    """Generate PDF CV from form data"""
    try:
        cv_data = request.json
        
        if not cv_data:
            return jsonify({
                'success': False,
                'error': 'No CV data provided'
            }), 400
        
        # Generate PDF
        pdf_buffer, result = pdf_service.generate(cv_data)
        
        if pdf_buffer is None:
            return jsonify({
                'success': False,
                'error': result  # result contains error message
            }), 500
        
        # Send PDF file
        return send_file(
            pdf_buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=result  # result contains filename
        )
        
    except Exception as e:
        print(f"[ERROR] PDF generation error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/generate_career_objective', methods=['POST'])
def generate_career_objective():
    """Generate AI career objective paragraph based on user data"""
    try:
        data = request.json
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # Generate career objective using LLM
        result = llm_service.generate_career_objective(data)
        
        if result.get('success'):
            return jsonify({
                'success': True, 
                'career_objective': result.get('career_objective', '')
            })
        else:
            return jsonify({
                'success': False,
                'error': result.get('error', 'Failed to generate career objective')
            }), 500
            
    except Exception as e:
        print(f"[ERROR] Career objective generation error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
