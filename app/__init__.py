"""
DREAM CV Generator Application Factory
"""
import os
from flask import Flask, jsonify, request
from .config import get_config


def create_app(config_class=None):
    """
    Application factory for creating Flask app instance
    
    Args:
        config_class: Configuration class to use (optional)
    
    Returns:
        Flask application instance
    """
    app = Flask(__name__)
    
    # Load configuration
    if config_class is None:
        config_class = get_config()
    app.config.from_object(config_class)
    
    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Register blueprints
    from .routes.main import main_bp
    from .routes.api import api_bp
    
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # Register legacy routes for backward compatibility
    from .routes import legacy
    legacy.register_legacy_routes(app)
    
    # ===== JSON ERROR HANDLERS =====
    # Return JSON responses for API errors instead of HTML
    
    @app.errorhandler(400)
    def bad_request(error):
        """Handle 400 Bad Request errors with JSON response"""
        if request.path.startswith('/api') or request.is_json or request.content_type == 'application/json':
            return jsonify({
                'success': False,
                'error': 'Bad request',
                'message': str(error.description) if hasattr(error, 'description') else 'Invalid request'
            }), 400
        return error
    
    @app.errorhandler(404)
    def not_found(error):
        """Handle 404 Not Found errors with JSON response"""
        if request.path.startswith('/api') or request.is_json or request.content_type == 'application/json':
            return jsonify({
                'success': False,
                'error': 'Endpoint not found',
                'message': f'The requested URL {request.path} was not found on this server'
            }), 404
        return error
    
    @app.errorhandler(405)
    def method_not_allowed(error):
        """Handle 405 Method Not Allowed errors with JSON response"""
        if request.path.startswith('/api') or request.is_json or request.content_type == 'application/json':
            return jsonify({
                'success': False,
                'error': 'Method not allowed',
                'message': f'The method {request.method} is not allowed for this endpoint'
            }), 405
        return error
    
    @app.errorhandler(500)
    def internal_server_error(error):
        """Handle 500 Internal Server Error with JSON response"""
        if request.path.startswith('/api') or request.is_json or request.content_type == 'application/json':
            return jsonify({
                'success': False,
                'error': 'Internal server error',
                'message': 'An unexpected error occurred'
            }), 500
        return error
    
    # ===== HEALTH CHECK ENDPOINT =====
    @app.route('/health')
    @app.route('/api/health')
    def health_check():
        """Health check endpoint for testing server availability"""
        return jsonify({
            'success': True,
            'status': 'healthy',
            'message': 'DREAM CV Generator API is running'
        })
    
    return app
