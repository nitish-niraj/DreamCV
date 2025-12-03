"""
DREAM CV Generator Application Factory
"""
import os
from flask import Flask
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
    
    return app
