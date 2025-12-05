# DREAM CV Generator - Developer Guide

> A comprehensive guide for developers contributing to the DREAM CV Generator project

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Project Structure](#project-structure)
4. [Backend Documentation](#backend-documentation)
5. [Frontend Documentation](#frontend-documentation)
6. [Services Deep Dive](#services-deep-dive)
7. [Configuration](#configuration)
8. [Adding New Features](#adding-new-features)
9. [Testing](#testing)
10. [Best Practices](#best-practices)

---

## Project Overview

DREAM CV Generator is a Flask-based web application that helps students and fresh graduates create professional CVs tailored to their dream companies. The application leverages AI (via Groq's LLM API) for intelligent resume parsing and content generation.

### Technology Stack

| Layer | Technology |
|-------|------------|
| Backend | Python 3.8+, Flask |
| Frontend | Vanilla JavaScript, HTML5, CSS3 |
| AI/LLM | Groq API (Llama 3.3 70B) |
| PDF Generation | xhtml2pdf, WeasyPrint |
| Document Parsing | PyPDF2, python-docx |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                          │
├─────────────────────────────────────────────────────────────────┤
│   upload.js  │  form.js  │  api.js  │  preview.js  │  utils.js  │
└──────────────┴───────────┴──────────┴──────────────┴────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Flask Backend                            │
├─────────────────────────────────────────────────────────────────┤
│   routes/        │     services/           │      utils/         │
│   ├── main.py    │     ├── llm_service.py  │      ├── helpers.py │
│   ├── api.py     │     ├── pdf_service.py  │      └── file_...   │
│   └── legacy.py  │     ├── resume_parser.py│                     │
│                  │     └── styles.py       │                     │
└──────────────────┴─────────────────────────┴────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   Groq LLM API  │
                    └─────────────────┘
```

### Request Flow

1. **User uploads resume** → `upload.js` handles file selection
2. **File sent to backend** → `/parse_resume` endpoint receives file
3. **Text extraction** → `resume_parser.py` extracts text based on file type
4. **AI parsing** → `llm_service.py` sends prompt to Groq API
5. **Response returned** → Structured JSON returned to frontend
6. **Form auto-filled** → `form.js` populates form fields

---

## Project Structure

```
dream-cv-generator/
│
├── run.py                    # Application entry point
├── requirements.txt          # Python dependencies
├── setup.bat                 # Windows setup script
├── run.bat                   # Windows run script
│
├── app/
│   ├── __init__.py          # Flask app factory
│   ├── config.py            # Configuration settings
│   │
│   ├── routes/              # API Route Handlers
│   │   ├── __init__.py
│   │   ├── main.py          # Main page routes
│   │   ├── api.py           # API endpoints (parse, generate, etc.)
│   │   └── legacy.py        # Deprecated routes (for compatibility)
│   │
│   ├── services/            # Business Logic Layer
│   │   ├── __init__.py
│   │   ├── llm_service.py   # LLM integration (Groq API)
│   │   ├── pdf_service.py   # PDF generation service
│   │   ├── resume_parser.py # Resume text extraction
│   │   ├── prompts.py       # LLM prompt templates
│   │   └── styles.py        # PDF CSS styles
│   │
│   ├── utils/               # Utility Functions
│   │   ├── __init__.py
│   │   ├── helpers.py       # General helper functions
│   │   └── file_handlers.py # File processing utilities
│   │
│   ├── static/              # Static Assets
│   │   ├── css/
│   │   │   ├── main.css     # Entry point (imports all)
│   │   │   ├── base.css     # Base styles & variables
│   │   │   ├── components.css
│   │   │   ├── form.css
│   │   │   ├── preview.css
│   │   │   ├── upload.css
│   │   │   └── responsive.css
│   │   │
│   │   └── js/
│   │       ├── app.js       # Application initialization
│   │       ├── api.js       # API communication layer
│   │       ├── form.js      # Form handling & validation
│   │       ├── upload.js    # File upload handling
│   │       ├── preview.js   # CV preview functionality
│   │       └── utils.js     # Shared utility functions
│   │
│   └── templates/           # Jinja2 Templates
│       ├── index.html       # Main application page
│       └── cv_template.html # PDF CV template
│
├── uploads/                  # Temporary file storage
│
└── docs/                     # Documentation
    ├── API_DOCUMENTATION.md
    └── DEVELOPER_GUIDE.md
```

---

## Backend Documentation

### Flask App Factory

The application uses Flask's app factory pattern for better modularity:

```python
# app/__init__.py
from flask import Flask

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    
    # Register blueprints
    from app.routes.main import main_bp
    from app.routes.api import api_bp
    
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp)
    
    return app
```

### Route Blueprints

#### Main Routes (`routes/main.py`)

Handles page rendering:

```python
from flask import Blueprint, render_template

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return render_template('index.html')
```

#### API Routes (`routes/api.py`)

Handles all API endpoints:

```python
from flask import Blueprint, request, jsonify
from app.services import llm_service, pdf_service, resume_parser

api_bp = Blueprint('api', __name__)

@api_bp.route('/parse_resume', methods=['POST'])
def parse_resume():
    # Handle file upload
    file = request.files.get('resume')
    if not file:
        return jsonify({'success': False, 'error': 'No file uploaded'}), 400
    
    # Extract text
    text = resume_parser.extract_text(file)
    
    # Parse with LLM
    parsed_data = llm_service.parse_resume(text)
    
    return jsonify({'success': True, 'data': parsed_data})
```

### Key API Endpoints

| Endpoint | Method | Handler | Description |
|----------|--------|---------|-------------|
| `/health` | GET | `app.health_check` | Health check endpoint |
| `/` | GET | `main.index` | Render main page |
| `/parse_resume` | POST | `api.parse_resume` | Parse uploaded resume |
| `/upload_photo` | POST | `api.upload_photo` | Upload profile photo |
| `/generate_pdf` | POST | `api.generate_pdf` | Generate CV PDF |
| `/generate_career_objective` | POST | `api.generate_career_objective` | AI career objective |
| `/generate_planned_skills` | POST | `api.generate_planned_skills` | AI skill suggestions |
| `/format_section` | POST | `api.format_section` | Format text with AI |

### URL Routing

All endpoints are available in multiple URL formats for backward compatibility:

- **With `/api` prefix**: `/api/parse_resume`, `/api/upload_photo`, etc.
- **Without prefix (legacy)**: `/parse_resume`, `/upload_photo`, etc.
- **Alternative formats**: `/career-objective`, `/planned-skills/suggestions`, etc.

### Error Handling

The application includes JSON error handlers for all HTTP error codes:

```python
# app/__init__.py
@app.errorhandler(404)
def not_found(error):
    if request.path.startswith('/api') or request.is_json:
        return jsonify({
            'success': False,
            'error': 'Endpoint not found',
            'message': f'The requested URL {request.path} was not found'
        }), 404
    return error
```

---

## Frontend Documentation

### JavaScript Modules

The frontend follows a modular architecture with clear separation of concerns:

#### `app.js` - Application Initialization

```javascript
// Entry point - initializes all modules
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    initializeUpload();
    initializeForm();
    initializePreview();
}
```

#### `api.js` - API Communication Layer

Handles all HTTP requests to the backend:

```javascript
// Parse resume API call
async function parseResume(file) {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await fetch('/parse_resume', {
        method: 'POST',
        body: formData
    });
    
    return await response.json();
}

// Generate career objective
async function generateCareerObjective(data) {
    const response = await fetch('/generate_career_objective', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
    return await response.json();
}

// Export globally for other modules
window.generateCareerObjective = generateCareerObjective;
```

#### `form.js` - Form Handling

Manages form state, validation, and DREAM alignment:

```javascript
// DREAM Company alignment configuration
const PLANNED_SKILLS_BY_COHORT = {
    "Full Stack Developer (Web/Mobile)": [
        "HTML, CSS, Bootstrap",
        "JavaScript (React/Vue/Angular)",
        "Node.js/Express.js"
    ],
    "AI/ML Engineer": [
        "Python (NumPy, Pandas, Matplotlib)",
        "Machine Learning (Scikit-learn)",
        "Deep Learning (TensorFlow/PyTorch)"
    ]
    // ... more cohorts
};

// Auto-update planned skills based on cohort
function updatePlannedSkillsForCohort(cohort) {
    const skills = PLANNED_SKILLS_BY_COHORT[cohort];
    if (skills) {
        const container = document.getElementById('planned-skills-container');
        // Clear and repopulate
        container.innerHTML = '';
        skills.forEach(skill => addPlannedSkillEntry(skill));
    }
}
```

#### `upload.js` - File Upload Handler

Manages file upload, drag-and-drop, and resume parsing:

```javascript
function setupUploadHandlers() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('resume-file');
    
    // Drag and drop events
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleDrop);
    
    // File input change
    fileInput.addEventListener('change', handleFileSelect);
}

async function handleFileSelect(event) {
    const file = event.target.files[0];
    
    if (!isValidFileType(file)) {
        showError('Invalid file type');
        return;
    }
    
    // Parse resume
    const result = await parseResume(file);
    
    if (result.success) {
        fillFormWithData(result.data);
        alignFormWithDreamDetails(); // Auto-align with DREAM company
    }
}
```

#### `preview.js` - CV Preview

Handles real-time CV preview updates:

```javascript
function updatePreview() {
    const formData = collectFormData();
    const previewHtml = generatePreviewHtml(formData);
    document.getElementById('cv-preview').innerHTML = previewHtml;
}

// Debounce preview updates for performance
const debouncedPreview = debounce(updatePreview, 300);

// Listen to form changes
document.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', debouncedPreview);
});
```

#### `utils.js` - Shared Utilities

Common functions used across modules:

```javascript
// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

// Sanitize HTML
function sanitizeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
```

---

## Services Deep Dive

### LLM Service (`services/llm_service.py`)

Handles all interactions with the Groq LLM API:

```python
import os
from groq import Groq
from .prompts import RESUME_PARSE_PROMPT, CAREER_OBJECTIVE_PROMPT

class LLMService:
    def __init__(self):
        self.client = Groq(api_key=os.getenv('GROQ_API_KEY'))
        self.model = "llama-3.3-70b-versatile"
    
    def parse_resume(self, text: str) -> dict:
        """Parse resume text using LLM."""
        prompt = RESUME_PARSE_PROMPT.format(resume_text=text)
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,  # Low temperature for consistent extraction
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
    
    def generate_career_objective(self, data: dict) -> str:
        """Generate AI-powered career objective."""
        prompt = CAREER_OBJECTIVE_PROMPT.format(**data)
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,  # Higher temperature for creativity
            max_tokens=200
        )
        
        return response.choices[0].message.content

llm_service = LLMService()
```

### Resume Parser (`services/resume_parser.py`)

Extracts text from various document formats:

```python
import PyPDF2
from docx import Document
import io

def extract_text(file) -> str:
    """Extract text from uploaded file based on type."""
    filename = file.filename.lower()
    
    if filename.endswith('.pdf'):
        return extract_from_pdf(file)
    elif filename.endswith('.docx'):
        return extract_from_docx(file)
    elif filename.endswith('.doc'):
        return extract_from_doc(file)
    elif filename.endswith('.txt'):
        return file.read().decode('utf-8')
    else:
        raise ValueError('Unsupported file type')

def extract_from_pdf(file) -> str:
    """Extract text from PDF file."""
    reader = PyPDF2.PdfReader(io.BytesIO(file.read()))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

def extract_from_docx(file) -> str:
    """Extract text from DOCX file."""
    doc = Document(io.BytesIO(file.read()))
    return "\n".join([para.text for para in doc.paragraphs])
```

### PDF Service (`services/pdf_service.py`)

Generates PDF CVs from HTML templates:

```python
from flask import render_template
from xhtml2pdf import pisa
from .styles import get_pdf_styles
import io

def generate_pdf(cv_data: dict) -> bytes:
    """Generate PDF CV from data."""
    # Render HTML template
    html_content = render_template('cv_template.html', **cv_data)
    
    # Add CSS styles
    styles = get_pdf_styles()
    full_html = f"<style>{styles}</style>{html_content}"
    
    # Generate PDF
    pdf_buffer = io.BytesIO()
    pisa_status = pisa.CreatePDF(
        src=full_html,
        dest=pdf_buffer,
        encoding='UTF-8'
    )
    
    if pisa_status.err:
        raise Exception("PDF generation failed")
    
    pdf_buffer.seek(0)
    return pdf_buffer.read()
```

### Styles Service (`services/styles.py`)

Contains CSS for PDF generation:

```python
def get_pdf_styles() -> str:
    """Return CSS styles for PDF generation."""
    return """
    @page {
        size: A4;
        margin: 0.6cm;
    }
    
    body {
        font-family: 'Garamond', 'Georgia', serif;
        font-size: 10pt;
        line-height: 1.3;
        color: #333;
    }
    
    .header {
        text-align: center;
        border-bottom: 1.5pt solid #000;
        padding-bottom: 6pt;
        margin-bottom: 8pt;
    }
    
    .section-title {
        font-size: 11pt;
        font-weight: bold;
        border-bottom: 0.75pt solid #000;
        margin-top: 8pt;
        margin-bottom: 4pt;
    }
    
    /* Entry separators */
    .experience-entry,
    .internship-entry,
    .project-entry {
        border-bottom: 0.5pt dashed #999;
        padding-bottom: 6pt;
        margin-bottom: 6pt;
    }
    
    .experience-entry:last-child,
    .internship-entry:last-child,
    .project-entry:last-child {
        border-bottom: none;
    }
    """
```

### Prompts (`services/prompts.py`)

LLM prompt templates:

```python
RESUME_PARSE_PROMPT = """
You are a professional resume parser. Extract the following information from the resume text and return as JSON:

{
    "full_name": "string",
    "email": "string",
    "phone": "string",
    "address": "string (city, state)",
    "linkedin": "string (URL)",
    "github": "string (URL)",
    "professional_summary": "string",
    "prog_languages": "string (comma-separated)",
    "web_tech": "string (comma-separated)",
    "databases": "string (comma-separated)",
    "qualifications": [...],
    "internships": [...],
    "projects": [...],
    "certifications": [...]
}

Resume Text:
{resume_text}

Return ONLY valid JSON, no markdown code blocks.
"""

CAREER_OBJECTIVE_PROMPT = """
Generate a professional career objective (2-3 sentences) for:
- Name: {name}
- Dream Company: {dream_company}
- Target Role: {target_role}
- Cohort: {cohort}
- Skills: {technical_skills}
- Education: {education}

The objective should be concise, professional, and tailored to the target company.
"""
```

---

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Required
GROQ_API_KEY=your_groq_api_key_here

# Optional
FLASK_ENV=development
FLASK_DEBUG=1
SECRET_KEY=your_secret_key_here
MAX_CONTENT_LENGTH=16777216  # 16MB max upload
```

### Application Config (`app/config.py`)

```python
import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'uploads')
    ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt'}
    
class DevelopmentConfig(Config):
    DEBUG = True
    
class ProductionConfig(Config):
    DEBUG = False
```

---

## Adding New Features

### Adding a New API Endpoint

1. **Create route handler in `routes/api.py`:**

```python
@api_bp.route('/new_feature', methods=['POST'])
def new_feature():
    data = request.get_json()
    # Process data
    result = some_service.process(data)
    return jsonify({'success': True, 'data': result})
```

2. **Create service function if needed:**

```python
# services/new_service.py
def process(data):
    # Business logic here
    return processed_data
```

3. **Add frontend API call in `api.js`:**

```javascript
async function newFeature(data) {
    const response = await fetch('/new_feature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await response.json();
}
```

### Adding a New Form Field

1. **Add HTML in `templates/index.html`:**

```html
<div class="form-group">
    <label for="new-field">New Field</label>
    <input type="text" id="new-field" name="new_field">
</div>
```

2. **Handle in `form.js`:**

```javascript
function collectFormData() {
    return {
        // ... existing fields
        new_field: document.getElementById('new-field').value
    };
}
```

3. **Update CV template if needed:**

```html
<!-- cv_template.html -->
{% if new_field %}
<p>{{ new_field }}</p>
{% endif %}
```

### Adding New Cohort Skills

Update `PLANNED_SKILLS_BY_COHORT` in `form.js`:

```javascript
const PLANNED_SKILLS_BY_COHORT = {
    // ... existing cohorts
    "New Cohort Name": [
        "Skill 1",
        "Skill 2",
        "Skill 3"
    ]
};
```

---

## Testing

### Test Environment Setup

```bash
# Install test dependencies
pip install pytest pytest-cov requests

# Ensure the server is running for integration tests
python run.py
```

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_api.py

# Run with verbose output
pytest -v
```

### Test Structure

```text
tests/
├── __init__.py
├── conftest.py           # Test fixtures
├── test_api.py           # API endpoint tests
├── test_llm_service.py   # LLM service tests
├── test_pdf_service.py   # PDF generation tests
└── test_resume_parser.py # Resume parser tests

testsprite_tests/         # Backend API integration tests
├── TC001_*.py            # Resume parsing tests
├── TC002_*.py            # Photo upload tests
├── TC003_*.py            # Career objective tests
├── TC004_*.py            # Section formatting tests
├── TC005_*.py            # PDF generation tests
├── TC006_*.py            # Planned skills tests
├── TC007_*.py            # Error handling tests
└── TC008_*.py            # Environment config tests
```

### API Integration Tests

Integration tests verify the API endpoints work correctly:

```python
# Example: Test resume parsing API
import requests

BASE_URL = "http://localhost:5000"

def test_resume_parsing_api():
    """Test that resume parsing returns structured data."""
    with open('test_resume.pdf', 'rb') as f:
        response = requests.post(
            f"{BASE_URL}/api/parse_resume",
            files={'resume': f}
        )
    
    assert response.status_code == 200
    data = response.json()
    assert data['success'] == True
    assert 'data' in data
    assert 'full_name' in data['data']

def test_career_objective_generation():
    """Test AI career objective generation."""
    payload = {
        "dream_company": "Google",
        "target_role": "Software Engineer",
        "technical_skills": "Python, JavaScript"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/generate_career_objective",
        json=payload
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data['success'] == True
    assert 'career_objective' in data

def test_health_endpoint():
    """Test health check endpoint."""
    response = requests.get(f"{BASE_URL}/health")
    
    assert response.status_code == 200
    data = response.json()
    assert data['success'] == True
    assert data['status'] == 'healthy'

def test_404_returns_json():
    """Test that 404 errors return JSON, not HTML."""
    response = requests.get(f"{BASE_URL}/api/nonexistent")
    
    assert response.status_code == 404
    assert response.headers['Content-Type'] == 'application/json'
    data = response.json()
    assert data['success'] == False
    assert 'error' in data
```

### Unit Tests

```python
# tests/test_api.py
import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    """Test health endpoint returns correct response."""
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json['success'] == True

def test_parse_resume_no_file(client):
    """Test parse_resume endpoint without file."""
    response = client.post('/api/parse_resume')
    assert response.status_code == 400
    assert response.json['success'] == False

def test_parse_resume_invalid_type(client):
    """Test parse_resume with invalid file type."""
    import io
    data = {'resume': (io.BytesIO(b'content'), 'test.xyz')}
    response = client.post('/api/parse_resume', data=data)
    assert response.status_code == 400

def test_photo_upload_no_file(client):
    """Test photo upload without file."""
    response = client.post('/api/upload_photo')
    assert response.status_code == 400
    assert 'error' in response.json

def test_career_objective_no_data(client):
    """Test career objective with no data."""
    response = client.post(
        '/api/generate_career_objective',
        content_type='application/json',
        data='{}'
    )
    # Should still work but with minimal output
    assert response.status_code in [200, 400]
```

### Test Coverage

Aim for at least 80% code coverage:

```bash
# Generate coverage report
pytest --cov=app --cov-report=html

# View report in browser
open htmlcov/index.html
```

---

## Best Practices

### Code Style

- **Python**: Follow PEP 8 guidelines
- **JavaScript**: Use ES6+ features, consistent naming
- **CSS**: BEM naming convention, organized by component

### Error Handling

```python
# Always wrap external calls in try-except
try:
    result = llm_service.parse_resume(text)
except Exception as e:
    app.logger.error(f"LLM parsing failed: {e}")
    return jsonify({'success': False, 'error': 'Parsing failed'}), 500
```

### Logging

```python
import logging

logger = logging.getLogger(__name__)

def some_function():
    logger.info("Processing started")
    logger.debug(f"Data received: {data}")
    logger.error("Error occurred", exc_info=True)
```

### Git Commit Messages

Follow conventional commits:

```
feat: add new cohort skills mapping
fix: correct resume parsing for multi-page PDFs
docs: update API documentation
refactor: simplify PDF generation logic
style: format JavaScript files
test: add tests for career objective generation
```

---

## Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Groq API Documentation](https://console.groq.com/docs)
- [xhtml2pdf Documentation](https://xhtml2pdf.readthedocs.io/)
- [JavaScript MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

<p align="center">
  Happy Coding! 🚀
</p>
