#!/usr/bin/env python
"""
DREAM CV Generator - Application Entry Point
Run this file to start the Flask development server
"""
from app import create_app

app = create_app()

if __name__ == '__main__':
    print("=" * 50)
    print("DREAM CV Generator")
    print("=" * 50)
    print(f"Starting server at http://127.0.0.1:5000")
    print("Press Ctrl+C to stop")
    print("=" * 50)
    
    app.run(
        host='127.0.0.1',
        port=5000,
        debug=True
    )
