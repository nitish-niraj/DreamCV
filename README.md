# 🎯 DREAM CV Generator

> **AI-Powered Resume Builder for Students & Fresh Graduates**

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A production-ready web application that generates professional DREAM CVs using AI assistance. Built with Flask using a modular architecture, this tool helps you create ATS-friendly CVs tailored to your dream company.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📷 **Photo Upload** | Add professional headshots to your CV |
| 🎯 **DREAM Company Targeting** | Align your CV with specific cohort, company, technology & role |
| 🤖 **AI Resume Parsing** | Upload existing resume and auto-fill all fields |
| 📝 **Smart Career Objective** | AI-generated professional summary tailored to your target |
| 💻 **Skills Management** | Organized technical skills with auto-suggestions |
| 🎓 **Academic Qualifications** | Structured education section |
| 🚀 **Projects & Experience** | Detailed projects, internships & work experience |
| 📄 **Professional PDF** | ATS-friendly PDF with Garamond font styling |
| 🌐 **Digital Profiles** | Integration with LeetCode, GitHub, HackerRank |

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| 📖 [API Documentation](./docs/API_DOCUMENTATION.md) | Complete API reference with examples, endpoints, and error codes |
| 🛠️ [Developer Guide](./docs/DEVELOPER_GUIDE.md) | Architecture, code structure, and contribution guidelines |

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.9+** - [Download here](https://www.python.org/downloads/)
- **GTK3 Runtime** (Windows only, for PDF generation) - [Download here](https://github.com/nicholls-state-libraries/weasyprint-binary/releases)

### Installation

**Option 1: Using Setup Script (Windows)**

```bash
cd E:\dbms\dream-cv-generator
setup.bat
```

**Option 2: Manual Installation**

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Running the Application

```bash
# Using run script (Windows)
run.bat

# Or manually
python run.py
```

Open your browser: [http://localhost:5000](http://localhost:5000)

---

## 📁 Project Structure

```text
dream-cv-generator/
├── run.py                    # Application entry point
├── requirements.txt          # Python dependencies
├── .env                      # Environment variables
│
├── app/                      # Main application package
│   ├── __init__.py           # App factory
│   ├── config.py             # Configuration
│   │
│   ├── routes/               # HTTP handlers
│   │   ├── main.py           # Page routes
│   │   ├── api.py            # API endpoints
│   │   └── legacy.py         # Backward compatibility
│   │
│   ├── services/             # Business logic
│   │   ├── llm_service.py    # LLM integration
│   │   ├── pdf_service.py    # PDF generation
│   │   ├── resume_parser.py  # Resume parsing
│   │   ├── prompts.py        # LLM prompts
│   │   └── styles.py         # PDF styles
│   │
│   ├── utils/                # Utilities
│   │   ├── file_handlers.py  # File processing
│   │   └── helpers.py        # Helper functions
│   │
│   ├── static/               # CSS, JS assets
│   │   ├── css/
│   │   └── js/
│   │
│   └── templates/            # HTML templates
│       ├── index.html
│       └── cv_template.html
│
├── uploads/                  # Temporary uploads
│
└── docs/                     # Documentation
    ├── API_DOCUMENTATION.md
    └── DEVELOPER_GUIDE.md
```

---

## 🔧 Configuration

The application uses environment variables for configuration. Create a `.env` file:

```env
GROQ_API_KEY=your_groq_api_key_here
FLASK_ENV=development
FLASK_DEBUG=1
```

### Available LLM Models

You can configure different models in your `.env`:

- `x-ai/grok-3-mini-beta:free` (Default)
- `google/gemma-2-9b-it:free`
- `meta-llama/llama-3.2-3b-instruct:free`
- `mistralai/mistral-7b-instruct:free`

---

## 📝 Usage Guide

1. **Personal Details** - Fill in name, contact info, LinkedIn, GitHub
2. **Upload Photo** - Add a formal photograph
3. **DREAM Company** - Select cohort, specify company, role, technology
4. **Academic Qualification** - Add educational background
5. **Technical Skills** - List programming languages, web tech, databases
6. **Certifications/Internships** - Add relevant certifications and experiences
7. **Projects** - Describe projects with technologies used
8. **Generate PDF** - Download your formatted DREAM CV

### CV Format Guidelines

| Element | Specification |
|---------|--------------|
| Font | Garamond (EB Garamond) |
| Heading Size | 11pt Bold |
| Body Size | 10.5pt Normal |
| Duration Format | `[From...To...]` in square brackets |
| Page Limit | Maximum 2 pages |

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/parse_resume` | POST | Parse uploaded resume with AI |
| `/upload_photo` | POST | Upload profile photo |
| `/generate_pdf` | POST | Generate CV PDF |
| `/generate_career_objective` | POST | AI career objective |
| `/format_section` | POST | Format text with AI |

For complete API documentation, see [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md).

---

## 🐛 Troubleshooting

### PDF Generation Issues (Windows)

If PDF generation fails, install GTK3:

1. Download GTK3 from the [releases page](https://github.com/nicholls-state-libraries/weasyprint-binary/releases)
2. Install and add to PATH: `C:\Program Files\GTK3-Runtime Win64\bin`
3. Restart your terminal

### Alternative: Using pdfkit

```bash
pip install pdfkit
```

Then download [wkhtmltopdf](https://wkhtmltopdf.org/downloads.html).

---

## 🤝 Contributing

We welcome contributions! See our [Developer Guide](./docs/DEVELOPER_GUIDE.md) for:

- Project architecture
- Code style guidelines
- How to add new features
- Testing procedures

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Flask](https://flask.palletsprojects.com/) - Web framework
- [Groq](https://groq.com/) - LLM API provider
- [xhtml2pdf](https://xhtml2pdf.readthedocs.io/) - PDF generation
- [PyPDF2](https://pypdf2.readthedocs.io/) - PDF parsing

---

<p align="center">
  Made with ❤️ for students and fresh graduates
</p>
