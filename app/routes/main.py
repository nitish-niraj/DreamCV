"""
Main Routes - Page rendering routes
"""
from flask import Blueprint, render_template, send_from_directory, current_app, Response
import os

main_bp = Blueprint('main', __name__)


@main_bp.route('/')
def index():
    """Render the main CV generator page"""
    return render_template('index.html')


@main_bp.route('/favicon.ico')
def favicon():
    """Serve favicon if exists, otherwise return empty response"""
    static_folder = current_app.static_folder or 'static'
    favicon_path = os.path.join(static_folder, 'favicon.ico')
    
    if os.path.exists(favicon_path):
        return send_from_directory(
            static_folder, 
            'favicon.ico', 
            mimetype='image/vnd.microsoft.icon'
        )
    # Return empty response to avoid 404 errors
    return Response(status=204)
