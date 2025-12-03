@echo off
echo ============================================
echo    DREAM CV Generator - Setup Script
echo ============================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.9+ from https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [OK] Python is installed
echo.

REM Create virtual environment
echo Creating virtual environment...
python -m venv .venv
if errorlevel 1 (
    echo [ERROR] Failed to create virtual environment!
    pause
    exit /b 1
)

echo [OK] Virtual environment created
echo.

REM Activate virtual environment
echo Activating virtual environment...
call .venv\Scripts\activate.bat

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip

REM Install dependencies from requirements.txt
echo.
echo Installing dependencies from requirements.txt...
pip install -r requirements.txt

echo.
echo ============================================
echo    Setup Complete!
echo ============================================
echo.
echo To run the application:
echo   1. Run: run.bat
echo   OR
echo   1. Activate venv: .venv\Scripts\activate
echo   2. Run: python app.py
echo.
echo The app will be available at: http://localhost:5000
echo.
echo Make sure to create a .env file with your OPENROUTER_API_KEY
echo.
pause
