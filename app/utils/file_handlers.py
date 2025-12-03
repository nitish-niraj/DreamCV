"""
File Handlers - File upload and text extraction utilities
Uses in-memory processing - files are NOT saved to disk
"""
import os
from flask import current_app


def allowed_file(filename: str) -> bool:
    """
    Check if file has allowed image extension
    
    Args:
        filename: Name of the file to check
        
    Returns:
        True if file extension is allowed
    """
    if not filename:
        return False
    allowed = current_app.config.get('ALLOWED_EXTENSIONS', {'png', 'jpg', 'jpeg', 'gif'})
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed


def allowed_resume_file(filename: str) -> bool:
    """
    Check if file has allowed resume extension
    
    Args:
        filename: Name of the file to check
        
    Returns:
        True if file extension is allowed for resumes
    """
    if not filename:
        return False
    allowed = current_app.config.get('RESUME_EXTENSIONS', {'pdf', 'doc', 'docx', 'txt'})
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed


def extract_text_from_file(file) -> str:
    """
    Extract text content from uploaded file
    
    Supports: PDF, DOCX, DOC, TXT
    
    Args:
        file: FileStorage object from request.files
        
    Returns:
        Extracted text content
    """
    filename = file.filename.lower()
    content = file.read()
    
    try:
        if filename.endswith('.pdf'):
            return _extract_from_pdf(content)
        elif filename.endswith('.docx'):
            return _extract_from_docx(content)
        elif filename.endswith('.doc'):
            return _extract_from_doc(content)
        elif filename.endswith('.txt'):
            return content.decode('utf-8', errors='ignore')
        else:
            return content.decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"[ERROR] Text extraction error: {e}")
        raise


def _extract_from_pdf(content: bytes) -> str:
    """Extract text from PDF content"""
    try:
        import PyPDF2
        from io import BytesIO
        
        pdf_reader = PyPDF2.PdfReader(BytesIO(content))
        text_parts = []
        
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
        
        return '\n'.join(text_parts)
    except ImportError:
        print("[WARNING] PyPDF2 not installed, trying pdfplumber")
        return _extract_from_pdf_fallback(content)


def _extract_from_pdf_fallback(content: bytes) -> str:
    """Fallback PDF extraction using pdfplumber"""
    try:
        import pdfplumber
        from io import BytesIO
        
        with pdfplumber.open(BytesIO(content)) as pdf:
            text_parts = []
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    text_parts.append(text)
            return '\n'.join(text_parts)
    except ImportError:
        raise ImportError("No PDF library available. Install PyPDF2 or pdfplumber.")


def _extract_from_docx(content: bytes) -> str:
    """Extract text from DOCX content"""
    try:
        from docx import Document
        from io import BytesIO
        
        doc = Document(BytesIO(content))
        paragraphs = [para.text for para in doc.paragraphs if para.text.strip()]
        return '\n'.join(paragraphs)
    except ImportError:
        raise ImportError("python-docx not installed. Run: pip install python-docx")


def _extract_from_doc(content: bytes) -> str:
    """Extract text from DOC content (legacy Word format)"""
    # DOC format is complex, try basic text extraction
    try:
        # Try using textract if available
        import textract
        from io import BytesIO
        import tempfile
        
        with tempfile.NamedTemporaryFile(suffix='.doc', delete=False) as tmp:
            tmp.write(content)
            tmp_path = tmp.name
        
        try:
            text = textract.process(tmp_path).decode('utf-8', errors='ignore')
            return text
        finally:
            os.unlink(tmp_path)
    except ImportError:
        # Fallback: try to extract any readable text
        return content.decode('utf-8', errors='ignore')
