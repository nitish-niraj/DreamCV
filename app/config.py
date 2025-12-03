"""
Configuration settings for DREAM CV Generator
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Config:
    """Base configuration class"""
    
    # Flask settings
    SECRET_KEY = os.getenv('SECRET_KEY', 'dream-cv-secret-key-2024')
    
    # File upload settings
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    RESUME_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt'}
    
    # OpenRouter API settings
    OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY', '')
    OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions'
    MODEL_NAME = os.getenv('MODEL_NAME', 'x-ai/grok-4.1-fast:free')
    
    # LLM settings
    LLM_TEMPERATURE = 0.7
    LLM_MAX_TOKENS = 2000
    LLM_TIMEOUT = 30


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True


# Configuration mapping
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}


def get_config():
    """Get configuration based on environment"""
    env = os.getenv('FLASK_ENV', 'development')
    return config.get(env, config['default'])
