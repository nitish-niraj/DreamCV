// DREAM CV Generator - Utility Functions Module

/**
 * Show a notification toast message
 * @param {string} message - The message to display
 * @param {string} type - Type: 'success', 'error', 'warning', 'info'
 */
function showNotification(message, type) {
    const alertClass = type === 'success' ? 'alert-success' : 
                       type === 'error' ? 'alert-danger' : 
                       type === 'warning' ? 'alert-warning' : 'alert-info';
    
    const notification = document.createElement('div');
    notification.className = `alert ${alertClass} position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        <button type="button" class="btn-close float-end" onclick="this.parentElement.remove()"></button>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

/**
 * Show the loading modal with a message
 * @param {string} message - Loading message to display
 */
function showLoading(message) {
    const loadingMessage = document.getElementById('loadingMessage');
    const modalElement = document.getElementById('loadingModal');
    
    if (loadingMessage) {
        loadingMessage.textContent = message;
    }
    
    if (modalElement) {
        // Check if modal already exists
        let modal = bootstrap.Modal.getInstance(modalElement);
        if (!modal) {
            modal = new bootstrap.Modal(modalElement, {
                backdrop: 'static',
                keyboard: false
            });
        }
        modal.show();
    }
}

/**
 * Hide the loading modal
 */
function hideLoading() {
    const modalElement = document.getElementById('loadingModal');
    
    if (!modalElement) return;
    
    try {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
    } catch (e) {
        console.log('[DEBUG] Modal hide error:', e);
    }
    
    // Force cleanup after a short delay to ensure modal is fully hidden
    setTimeout(() => {
        // Remove any lingering backdrops
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.remove();
        });
        
        // Reset body styles
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        // Ensure the modal element is hidden
        if (modalElement) {
            modalElement.classList.remove('show');
            modalElement.style.display = 'none';
            modalElement.setAttribute('aria-hidden', 'true');
            modalElement.removeAttribute('aria-modal');
            modalElement.removeAttribute('role');
        }
    }, 350);
}

/**
 * Show a toast notification message
 * @param {string} message - The message to display
 * @param {string} type - Type: 'success', 'error', 'warning', 'info'
 */
function showToast(message, type = 'info') {
    showNotification(message, type);
}

/**
 * Convert markdown-style text to HTML
 * Handles **bold**, *italic*, and newlines
 * @param {string} text - The markdown text
 * @returns {string} HTML formatted text
 */
function markdownToHtml(text) {
    if (!text) return '';
    return text
        // Bold: **text** or __text__
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/__([^_]+)__/g, '<strong>$1</strong>')
        // Italic: *text* or _text_
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/_([^_]+)_/g, '<em>$1</em>')
        // Code: `text`
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Bullet points: - or *
        .replace(/^[\-\*]\s+(.+)$/gm, '<li>$1</li>')
        // Numbered lists: 1. 2. etc
        .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
        // Newlines to <br>
        .replace(/\n/g, '<br>');
}

/**
 * Update the form completion progress bar
 */
function updateProgress() {
    const form = document.getElementById('cvForm');
    const inputs = form.querySelectorAll('input[required], select[required]');
    let filled = 0;
    
    inputs.forEach(input => {
        if (input.value.trim()) filled++;
    });
    
    const percentage = (filled / inputs.length) * 100;
    document.querySelector('.progress-bar').style.width = percentage + '%';
}

/**
 * Prevent default browser behavior for drag events
 * @param {Event} e - The event object
 */
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Export functions for use in other modules
window.CVUtils = {
    showNotification,
    showLoading,
    hideLoading,
    markdownToHtml,
    updateProgress,
    preventDefaults
};
