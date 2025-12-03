/**
 * DREAM CV Generator - Main Entry Point
 * 
 * This file initializes all modules and sets up event listeners.
 * The application is split into modules:
 * - utils.js: Helper functions (notifications, loading, progress)
 * - form.js: Dynamic form entry management
 * - upload.js: Resume and photo upload handling
 * - preview.js: Live CV preview generation
 * - api.js: AI and PDF API operations
 */

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('[DREAM CV] Initializing application...');
    
    // Initialize drag-drop for resume upload
    initDragDropZone();
    
    // Initialize photo upload
    initPhotoUpload();
    
    // Set up form event listeners for live preview
    initFormListeners();
    
    console.log('[DREAM CV] Application initialized successfully!');
});

/**
 * Initialize form event listeners for live updates
 */
function initFormListeners() {
    const form = document.getElementById('cvForm');
    
    if (!form) {
        console.warn('[DREAM CV] Form not found');
        return;
    }
    
    // Update preview and progress on input changes
    form.addEventListener('input', function() {
        updateProgress();
        updateLivePreview();
    });
    
    form.addEventListener('change', function() {
        updateProgress();
        updateLivePreview();
    });
}

// ===== GLOBAL FUNCTION EXPORTS =====
// These functions are called from HTML onclick handlers

// Form entry functions (from form.js)
// Already globally available: addQualification, addInternship, addCertification, 
// addProject, addResponsibility, addExperience, addLanguage, removeEntry, collectFormData

// Upload functions (from upload.js)
// Already globally available: initDragDropZone, initPhotoUpload, handleResumeUpload, autoFillFormFromResume

// Preview functions (from preview.js)
// Already globally available: updateLivePreview

// Utility functions (from utils.js)
// Already globally available: showNotification, showLoading, hideLoading, updateProgress, preventDefaults

// API functions (from api.js)
// Already globally available: openNaturalLanguageModal, processNaturalLanguage, generateCareerObjective,
// formatSection, getSuggestions, generatePDF
