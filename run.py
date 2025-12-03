#!/usr/bin/env python
"""
DREAM CV Generator - Application Entry Point
Production-ready Flask application for Render deployment
"""
import os
from app import create_app

# Create Flask application instance
app = create_app()

if __name__ == '__main__':
    # Get port from environment variable (Render sets this automatically)
    port = int(os.environ.get('PORT', 5000))
    
    # Check if running in development mode
    is_dev = os.environ.get('FLASK_ENV') == 'development'
    
    if is_dev:
        print("=" * 50)
        print("DREAM CV Generator")
        print("=" * 50)
        print(f"Starting server at http://127.0.0.1:{port}")
        print("Press Ctrl+C to stop")
        print("=" * 50)
    
    # Start server - use 0.0.0.0 to accept external connections
    app.run(
        host='0.0.0.0',
        port=port,
        debug=is_dev
    )

