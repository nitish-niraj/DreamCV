# DREAM CV Generator - API Documentation

> **Version:** 1.1.0  
> **Last Updated:** December 6, 2025  
> **License:** MIT

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
   - [Installation](#installation)
   - [Quick Start](#quick-start)
3. [API Endpoints](#api-endpoints)
   - [Health Check](#health-check)
   - [Resume Parsing](#resume-parsing)
   - [Photo Upload](#photo-upload)
   - [PDF Generation](#pdf-generation)
   - [AI Features](#ai-features)
   - [Planned Skills](#planned-skills)
4. [Endpoint URL Variants](#endpoint-url-variants)
5. [Authentication](#authentication)
6. [Request & Response Format](#request--response-format)
7. [Error Handling](#error-handling)
8. [Code Examples](#code-examples)
9. [Troubleshooting](#troubleshooting)
10. [Contributing](#contributing)
11. [Support](#support)

---

## Overview

**DREAM CV Generator** is an AI-powered resume/CV builder designed specifically for students and fresh graduates targeting their dream companies. The application uses LLM technology to parse resumes, generate professional summaries, and create ATS-friendly PDF CVs.

### What This API Does

- **Resume Parsing**: Upload PDF, DOC, DOCX, or TXT files and extract structured data using AI
- **Smart Auto-Fill**: Automatically populate CV forms with extracted resume data
- **Career Objective Generation**: AI-generated professional summaries aligned with your dream company
- **PDF Generation**: Create beautifully formatted, ATS-friendly PDF CVs
- **DREAM Company Alignment**: Skills and objectives tailored to your target role/company

### Key Features

- ✅ Multi-format resume parsing (PDF, DOC, DOCX, TXT)
- ✅ AI-powered data extraction using LLM
- ✅ Cohort-based skill recommendations
- ✅ Auto-generated career objectives
- ✅ Professional PDF output with Garamond font
- ✅ Digital profile integration (LeetCode, GitHub, etc.)

---

## Getting Started

### Installation

**Prerequisites:**
- Python 3.8 or higher
- pip (Python package manager)

**Step 1: Clone the Repository**
```bash
git clone https://github.com/your-repo/dream-cv-generator.git
cd dream-cv-generator
```

**Step 2: Install Dependencies**
```bash
pip install -r requirements.txt
```

**Step 3: Configure Environment**
Create a `.env` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key_here
FLASK_ENV=development
```

**Step 4: Run the Application**
```bash
python run.py
```

The server will start at `http://127.0.0.1:5000`

### Quick Start

```python
import requests

# Upload and parse a resume
with open('resume.pdf', 'rb') as f:
    response = requests.post(
        'http://127.0.0.1:5000/parse_resume',
        files={'resume': f}
    )
    
parsed_data = response.json()
print(parsed_data['data']['full_name'])
```

---

## API Endpoints

### Base URL

```
http://127.0.0.1:5000
```

All endpoints are available both with and without the `/api` prefix for flexibility.

---

### Health Check

Check if the API server is running and healthy.

**Endpoints:** 
- `GET /health`
- `GET /api/health`

#### Request Example

```bash
curl http://127.0.0.1:5000/health
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "status": "healthy",
  "message": "DREAM CV Generator API is running"
}
```

---

### Resume Parsing

Parse an uploaded resume file and extract structured data using AI.

**Endpoint:** `POST /parse_resume`

**Content-Type:** `multipart/form-data`

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `resume` | File | Yes | Resume file (PDF, DOC, DOCX, or TXT) |

#### Request Example

```bash
curl -X POST http://127.0.0.1:5000/parse_resume \
  -F "resume=@/path/to/resume.pdf"
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "full_name": "John Doe",
    "email": "john.doe@email.com",
    "phone": "+91 9876543210",
    "address": "Mumbai, Maharashtra",
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe",
    "professional_summary": "Aspiring Software Developer...",
    "prog_languages": "Python, Java, JavaScript",
    "web_tech": "React, Node.js, Django",
    "databases": "MySQL, MongoDB",
    "qualifications": [
      {
        "degree": "B.Tech in Computer Science",
        "institution": "XYZ Engineering College",
        "board": "ABC University",
        "year": "2024",
        "score": "8.5 CGPA",
        "duration": "2020 - 2024"
      }
    ],
    "internships": [
      {
        "company": "Tech Corp",
        "role": "Software Intern",
        "duration": "June 2023 - August 2023",
        "mode": "Remote",
        "bullets": [
          "Developed REST APIs using Python Flask",
          "Implemented automated testing framework"
        ]
      }
    ],
    "projects": [
      {
        "name": "E-Commerce Platform",
        "role": "Full Stack Developer",
        "duration": "Jan 2024 - Mar 2024",
        "tech": "React, Node.js, MongoDB",
        "bullets": [
          "Built responsive frontend with React.js",
          "Implemented payment gateway integration"
        ],
        "link": "https://github.com/johndoe/ecommerce"
      }
    ],
    "certifications": [
      {
        "title": "AWS Cloud Practitioner",
        "source": "Amazon Web Services",
        "date": "March 2024",
        "type": "Certification"
      }
    ],
    "leetcode": "https://leetcode.com/johndoe",
    "hackerrank": "https://hackerrank.com/johndoe"
  }
}
```

#### Error Response (400 Bad Request)

```json
{
  "success": false,
  "error": "Invalid file type. Use PDF, DOC, DOCX, or TXT"
}
```

---

### Photo Upload

Upload a profile photo for the CV.

**Endpoint:** `POST /upload_photo`

**Content-Type:** `multipart/form-data`

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `photo` | File | Yes | Image file (PNG, JPG, JPEG) |

#### Request Example

```bash
curl -X POST http://127.0.0.1:5000/upload_photo \
  -F "photo=@/path/to/photo.jpg"
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "photo_url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA...",
  "is_base64": true
}
```

#### Error Response (400 Bad Request)

```json
{
  "success": false,
  "error": "Invalid file type. Use PNG, JPG, or JPEG"
}
```

---

### PDF Generation

Generate a PDF CV from form data.

**Endpoint:** `POST /generate_pdf`

**Content-Type:** `application/json`

#### Request Body

```json
{
  "full_name": "John Doe",
  "email": "john.doe@email.com",
  "phone": "+91 9876543210",
  "dream_company": "Google",
  "target_role": "Software Engineer",
  "cohort": "Full Stack Developer (Web/Mobile)",
  "target_technology": "Full Stack",
  "professional_summary": "Aspiring Software Engineer...",
  "prog_languages": "Python, Java, JavaScript",
  "web_tech": "React, Node.js",
  "databases": "MySQL, MongoDB",
  "qualifications": [...],
  "internships": [...],
  "projects": [...],
  "certifications": [...]
}
```

#### Success Response (200 OK)

Returns a PDF file download with `Content-Type: application/pdf`

#### Error Response (500 Internal Server Error)

```json
{
  "success": false,
  "error": "PDF generation failed: [error details]"
}
```

---

### AI Features

#### Generate Career Objective

Generate an AI-powered career objective based on user data and dream company details.

**Endpoint:** `POST /generate_career_objective`

**Content-Type:** `application/json`

#### Request Body

```json
{
  "name": "John Doe",
  "dream_company": "Google",
  "target_role": "Software Engineer",
  "target_technology": "Full Stack",
  "cohort": "Full Stack Developer (Web/Mobile)",
  "technical_skills": "Python, React, Node.js, MongoDB",
  "work_experience": "Software Intern at Tech Corp",
  "projects": "E-Commerce Platform, Chat Application",
  "education": "B.Tech from XYZ Engineering College"
}
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "career_objective": "Aspiring Software Engineer pursuing B.Tech in Computer Science, focused on Full Stack development with expertise in React and Node.js. Targeting a role at Google under the Full Stack Developer cohort. Motivated to build scalable web applications and contribute to innovative solutions."
}
```

---

#### Format Section with AI

Format a CV section using AI for professional language.

**Endpoint:** `POST /format_section`

**Content-Type:** `application/json`

#### Request Body

```json
{
  "section": "project",
  "content": "I made an ecommerce website using react and node. It has payment integration and user authentication."
}
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "formatted": "Developed a full-stack e-commerce platform using React.js and Node.js, featuring secure payment gateway integration and robust user authentication system."
}
```

---

#### Natural Language Processing

Convert natural language descriptions into structured resume format.

**Endpoint:** `POST /format_natural_language`

**Content-Type:** `application/json`

#### Request Body

```json
{
  "section_type": "project",
  "input": "I built an online shopping website where users can buy products. Used React for frontend and Node.js for backend. Added Stripe for payments."
}
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "name": "E-Commerce Shopping Platform",
    "role": "Full Stack Developer",
    "duration": "",
    "tech": "React.js, Node.js, Stripe API",
    "bullets": [
      "Developed full-stack e-commerce platform enabling seamless online shopping experience",
      "Implemented secure payment processing using Stripe payment gateway",
      "Built responsive React.js frontend with modern UI/UX design"
    ]
  }
}
```

---

#### Generate Planned Skills

Generate AI-powered skill suggestions based on cohort and dream company.

**Endpoints:**
- `POST /generate_planned_skills`
- `POST /api/generate_planned_skills`
- `POST /planned-skills/suggestions`
- `POST /api/planned-skills/suggestions`

**Content-Type:** `application/json`

#### Request Body

```json
{
  "cohort": "Full Stack Developer",
  "dream_company": "Google",
  "target_role": "Software Engineer",
  "target_technology": "Cloud & DevOps",
  "prog_languages": "Python, JavaScript",
  "web_tech": "React, Node.js",
  "databases": "PostgreSQL, MongoDB"
}
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "suggested_skills": ["Kubernetes", "Docker", "AWS", "GCP", "Terraform", "CI/CD"],
  "planned_skills": {
    "cloud": ["AWS", "GCP", "Azure"],
    "devops": ["Docker", "Kubernetes", "Jenkins"]
  },
  "planned_certifications": ["AWS Solutions Architect", "GCP Professional Cloud Architect"],
  "learning_path": "Start with Docker fundamentals, then move to Kubernetes..."
}
```

---

## Endpoint URL Variants

For flexibility and backward compatibility, all endpoints are available in multiple URL formats:

### Photo Upload Variants
| URL Pattern | Description |
|-------------|-------------|
| `/api/upload_photo` | Primary API endpoint |
| `/upload_photo` | Legacy route |
| `/api/photo/upload` | Alternative format |
| `/api/photo-upload` | Hyphenated format |
| `/photo/upload` | Legacy alternative |

### Resume Parsing Variants
| URL Pattern | Description |
|-------------|-------------|
| `/api/parse_resume` | Primary API endpoint |
| `/parse_resume` | Legacy route |
| `/parse-resume` | Hyphenated format |
| `/resume/parse` | Slash-separated format |

### PDF Generation Variants
| URL Pattern | Description |
|-------------|-------------|
| `/api/generate_pdf` | Primary API endpoint |
| `/generate_pdf` | Legacy route |
| `/api/pdf/generate` | Alternative format |
| `/pdf/generate` | Slash-separated format |

### Career Objective Variants
| URL Pattern | Description |
|-------------|-------------|
| `/api/generate_career_objective` | Primary API endpoint |
| `/generate_career_objective` | Legacy route |
| `/api/career-objective` | Hyphenated format |
| `/career-objective` | Legacy hyphenated |
| `/career_objective` | Underscore format |

### Section Formatting Variants
| URL Pattern | Description |
|-------------|-------------|
| `/api/format_section` | Primary API endpoint |
| `/format_section` | Legacy route |
| `/api/format/section` | Slash-separated format |
| `/format/section` | Legacy slash-separated |

### Planned Skills Variants
| URL Pattern | Description |
|-------------|-------------|
| `/api/generate_planned_skills` | Primary API endpoint |
| `/generate_planned_skills` | Legacy route |
| `/api/planned-skills/suggestions` | Alternative format |
| `/planned-skills/suggestions` | Legacy alternative |
| `/planned_skills` | Underscore format |

---

## Authentication

Currently, the DREAM CV Generator API does not require authentication for local development. All endpoints are publicly accessible when running locally.

> ⚠️ **Note:** For production deployment, implement proper authentication (API keys or OAuth) to secure endpoints.

---

## Request & Response Format

### Content Types

| Endpoint | Request Type | Response Type |
|----------|--------------|---------------|
| `/health` | - | `application/json` |
| `/parse_resume` | `multipart/form-data` | `application/json` |
| `/upload_photo` | `multipart/form-data` | `application/json` |
| `/generate_pdf` | `application/json` | `application/pdf` |
| `/generate_career_objective` | `application/json` | `application/json` |
| `/generate_planned_skills` | `application/json` | `application/json` |
| `/format_section` | `application/json` | `application/json` |
| `/format_natural_language` | `application/json` | `application/json` |

### Standard Response Structure

**Success Response:**

```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "Error description"
}
```

---

## Error Handling

### JSON Error Responses

All API endpoints return JSON error responses instead of HTML pages. This makes it easier to handle errors programmatically.

### HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid request parameters, missing fields, or invalid file type |
| 404 | Not Found | Endpoint not found |
| 405 | Method Not Allowed | HTTP method not supported for this endpoint |
| 500 | Internal Server Error | Server-side error (LLM failure, PDF generation error) |

### Error Response Formats

#### 400 Bad Request

```json
{
  "success": false,
  "error": "Bad request",
  "message": "Invalid request details"
}
```

#### 404 Not Found

```json
{
  "success": false,
  "error": "Endpoint not found",
  "message": "The requested URL /api/unknown was not found on this server"
}
```

#### 405 Method Not Allowed

```json
{
  "success": false,
  "error": "Method not allowed",
  "message": "The method GET is not allowed for this endpoint"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

### Common Application Errors

#### File Upload Errors

```json
{
  "success": false,
  "error": "No resume file uploaded"
}
```

```json
{
  "success": false,
  "error": "Unsupported file type detected. Please upload a valid resume format."
}
```

```json
{
  "success": false,
  "error": "Could not extract enough text from the file"
}
```

#### AI Processing Errors

```json
{
  "success": false,
  "error": "Failed to parse resume content"
}
```

```json
{
  "success": false,
  "error": "Failed to generate career objective"
}
```

#### PDF Generation Errors

```json
{
  "success": false,
  "error": "No CV data provided"
}
```

---

## Code Examples

### Python - Parse Resume

```python
import requests

def parse_resume(file_path):
    url = "http://127.0.0.1:5000/parse_resume"
    
    with open(file_path, 'rb') as f:
        files = {'resume': (file_path, f)}
        response = requests.post(url, files=files)
    
    if response.status_code == 200:
        data = response.json()
        if data['success']:
            return data['data']
        else:
            print(f"Error: {data['error']}")
    return None

# Usage
resume_data = parse_resume("my_resume.pdf")
print(f"Name: {resume_data['full_name']}")
print(f"Email: {resume_data['email']}")
```

### JavaScript (Fetch API) - Generate PDF

```javascript
async function generatePDF(cvData) {
    const response = await fetch('/generate_pdf', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cvData)
    });
    
    if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'DREAM_CV.pdf';
        a.click();
    } else {
        const error = await response.json();
        console.error('PDF generation failed:', error.error);
    }
}
```

### JavaScript - Upload and Parse Resume

```javascript
async function uploadResume(file) {
    const formData = new FormData();
    formData.append('resume', file);
    
    try {
        const response = await fetch('/parse_resume', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('Parsed data:', result.data);
            // Auto-fill form with parsed data
            document.querySelector('[name="full_name"]').value = result.data.full_name;
            document.querySelector('[name="email"]').value = result.data.email;
        } else {
            console.error('Parse error:', result.error);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}
```

---

## Troubleshooting

### Common Issues

#### 1. Resume Parsing Returns Empty Data

**Problem:** The API returns success but extracted data is mostly empty.

**Solutions:**
- Ensure the resume has selectable text (not a scanned image)
- Check if the file is corrupted
- Try converting to PDF using a different tool
- Ensure the resume follows a standard format

#### 2. PDF Generation Fails

**Problem:** Getting "PDF generation failed" error.

**Solutions:**
- Check if all required fields are provided (full_name, email)
- Ensure photo data is valid base64 (if provided)
- Check server logs for detailed error messages

#### 3. AI Features Not Working

**Problem:** Career objective generation or AI formatting fails.

**Solutions:**
- Verify GROQ_API_KEY is set in environment variables
- Check internet connectivity
- Ensure the API key has sufficient quota

#### 4. File Upload Size Limit

**Problem:** Large files fail to upload.

**Solutions:**
- Keep resume files under 10MB
- Compress PDFs before uploading
- Remove unnecessary images from documents

### Debug Mode

Enable debug logging by setting:
```env
FLASK_DEBUG=1
```

Check console output for detailed error messages and stack traces.

---

## Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute

1. **Report Bugs** - Open an issue with detailed steps to reproduce
2. **Suggest Features** - Share ideas for new functionality
3. **Submit Pull Requests** - Fix bugs or implement features
4. **Improve Documentation** - Help make docs clearer

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/your-username/dream-cv-generator.git
cd dream-cv-generator

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run in development mode
python run.py
```

### Code Style

- Follow PEP 8 for Python code
- Use meaningful variable and function names
- Add comments for complex logic
- Write docstrings for all functions

### Issue Tracker

- GitHub Issues: [github.com/your-repo/dream-cv-generator/issues](https://github.com/your-repo/dream-cv-generator/issues)

---

## Support

### Getting Help

- **Documentation**: You're reading it!
- **GitHub Issues**: For bugs and feature requests
- **Email**: support@dreamcv.example.com

### FAQ

**Q: What file formats are supported for resume upload?**  
A: PDF, DOC, DOCX, and TXT files are supported.

**Q: Is my data stored on the server?**  
A: No, all processing is done in-memory. Files are not permanently stored.

**Q: Can I use this for commercial purposes?**  
A: Check the LICENSE file for usage terms.

**Q: How accurate is the AI parsing?**  
A: Accuracy depends on resume format. Standard, well-structured resumes yield the best results.

---

## Changelog

### Version 1.0.0 (December 2025)
- Initial release
- Resume parsing (PDF, DOC, DOCX, TXT)
- AI-powered career objective generation
- DREAM Company alignment features
- PDF CV generation
- Digital profile integration

---

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

<p align="center">
  Made with ❤️ for students and fresh graduates
</p>
