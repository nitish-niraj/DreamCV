"""
Helpers - General utility functions
"""
import re
import uuid


def sanitize_filename(filename: str) -> str:
    """
    Sanitize a filename to remove unsafe characters
    
    Args:
        filename: Original filename
        
    Returns:
        Sanitized filename safe for filesystem
    """
    if not filename:
        return "file"
    
    # Remove or replace unsafe characters
    safe_name = re.sub(r'[<>:"/\\|?*]', '', filename)
    safe_name = re.sub(r'\s+', '_', safe_name)
    safe_name = safe_name.strip('._')
    
    return safe_name if safe_name else "file"


def generate_unique_id(prefix: str = '') -> str:
    """
    Generate a unique identifier
    
    Args:
        prefix: Optional prefix for the ID
        
    Returns:
        Unique identifier string
    """
    unique_part = uuid.uuid4().hex[:12]
    return f"{prefix}{unique_part}" if prefix else unique_part


def truncate_text(text: str, max_length: int = 100, suffix: str = '...') -> str:
    """
    Truncate text to specified length
    
    Args:
        text: Text to truncate
        max_length: Maximum length
        suffix: Suffix to add if truncated
        
    Returns:
        Truncated text
    """
    if not text or len(text) <= max_length:
        return text
    
    return text[:max_length - len(suffix)] + suffix


def clean_whitespace(text: str) -> str:
    """
    Clean excessive whitespace from text
    
    Args:
        text: Text to clean
        
    Returns:
        Text with normalized whitespace
    """
    if not text:
        return ""
    
    # Replace multiple spaces/newlines with single space
    cleaned = re.sub(r'\s+', ' ', text)
    return cleaned.strip()


def format_phone(phone: str) -> str:
    """
    Format phone number consistently
    
    Args:
        phone: Raw phone number
        
    Returns:
        Formatted phone number
    """
    if not phone:
        return ""
    
    # Remove all non-digit characters except +
    digits = re.sub(r'[^\d+]', '', phone)
    
    # Add +91 prefix if Indian number without country code
    if len(digits) == 10 and digits.isdigit():
        return f"+91 {digits}"
    
    return digits


def is_valid_email(email: str) -> bool:
    """
    Validate email format
    
    Args:
        email: Email address to validate
        
    Returns:
        True if email format is valid
    """
    if not email:
        return False
    
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def is_valid_url(url: str) -> bool:
    """
    Validate URL format
    
    Args:
        url: URL to validate
        
    Returns:
        True if URL format is valid
    """
    if not url:
        return False
    
    pattern = r'^https?://[^\s<>"{}|\\^`\[\]]+'
    return bool(re.match(pattern, url))
