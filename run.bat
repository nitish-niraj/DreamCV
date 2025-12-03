@echo off
echo ============================================
echo    DREAM CV Generator - Starting...
echo ============================================
echo.

REM Check if venv exists
if not exist ".venv\Scripts\activate.bat" (
    echo [ERROR] Virtual environment not found!
    echo Please run setup.bat first.
    pause
    exit /b 1
)

REM Activate virtual environment
call .venv\Scripts\activate.bat

echo Starting the application...
echo.
echo ============================================
echo    Open http://localhost:5000 in your browser
echo    Press Ctrl+C to stop the server
echo ============================================
echo.

python run.py
