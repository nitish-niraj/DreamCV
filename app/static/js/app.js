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

// ===== GLOBAL STATE =====
let currentStep = 1;
let dreamDetailsCompleted = false;

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('[DREAM CV] Initializing application...');
    
    // Initialize step wizard
    initStepWizard();
    
    // Initialize drag-drop for resume upload
    initDragDropZone();
    
    // Initialize photo upload
    initPhotoUpload();
    
    // Set up form event listeners for live preview
    initFormListeners();
    
    // Initialize DREAM details validation
    initDreamDetailsValidation();
    
    console.log('[DREAM CV] Application initialized successfully!');
});

/**
 * Initialize step wizard functionality
 */
function initStepWizard() {
    updateStepWizard(1);
}

/**
 * Initialize DREAM details validation
 * Enables/disables proceed button based on required fields
 */
function initDreamDetailsValidation() {
    const cohortSelect = document.getElementById('dreamCohort');
    const companyInput = document.getElementById('dreamCompany');
    const roleInput = document.getElementById('dreamRole');
    const techInput = document.getElementById('dreamTech');
    const proceedBtn = document.getElementById('btnProceedToStep2');
    
    const validateDreamDetails = () => {
        const cohort = cohortSelect?.value || '';
        const company = companyInput?.value?.trim() || '';
        const role = roleInput?.value?.trim() || '';
        const tech = techInput?.value?.trim() || '';
        
        const isValid = cohort && company && role;
        
        if (proceedBtn) {
            proceedBtn.disabled = !isValid;
        }
        
        dreamDetailsCompleted = isValid;
        return isValid;
    };
    
    // Add listeners to all DREAM fields
    [cohortSelect, companyInput, roleInput, techInput].forEach(el => {
        if (el) {
            el.addEventListener('input', validateDreamDetails);
            el.addEventListener('change', validateDreamDetails);
        }
    });
    
    // Initial validation
    validateDreamDetails();
}

/**
 * Update step wizard UI
 */
function updateStepWizard(step) {
    currentStep = step;
    const steps = document.querySelectorAll('.step-wizard .step');
    const connectors = document.querySelectorAll('.step-wizard .step-connector');
    
    steps.forEach((stepEl, index) => {
        const stepNum = index + 1;
        stepEl.classList.remove('active', 'completed');
        
        if (stepNum < step) {
            stepEl.classList.add('completed');
        } else if (stepNum === step) {
            stepEl.classList.add('active');
        }
    });
    
    connectors.forEach((connector, index) => {
        if (index < step - 1) {
            connector.style.background = '#28a745';
        } else {
            connector.style.background = '#dee2e6';
        }
    });
}

/**
 * Navigate to a specific step
 */
function goToStep(step) {
    // Don't allow going to steps beyond current if DREAM details not complete
    if (step > 1 && !dreamDetailsCompleted) {
        showToast('Please complete DREAM Company Details first!', 'warning');
        return;
    }
    
    // Hide all step contents
    document.querySelectorAll('.step-content').forEach(el => {
        el.style.display = 'none';
    });
    
    // Show target step content
    const stepContent = document.getElementById(`step${step}Content`);
    if (stepContent) {
        stepContent.style.display = 'block';
    }
    
    updateStepWizard(step);
    
    // Scroll to top of form
    document.querySelector('.form-container')?.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Proceed from Step 1 (DREAM Details) to Step 2 (Resume Upload)
 */
function proceedToStep2() {
    if (!dreamDetailsCompleted) {
        showToast('Please fill all required DREAM Company fields!', 'warning');
        return;
    }
    
    // Update the dream target summary
    updateDreamTargetSummary();
    
    // Auto-align skills based on cohort
    const cohort = document.getElementById('dreamCohort')?.value;
    if (cohort && typeof organizeSkillsForCohort === 'function') {
        organizeSkillsForCohort();
    }
    
    goToStep(2);
    showToast('Great! Now upload your resume or fill details manually.', 'success');
}

/**
 * Proceed from Step 2 (Resume Upload) to Step 3 (Complete Profile)
 */
function proceedToStep3() {
    goToStep(3);
    
    // Update progress
    if (typeof updateProgress === 'function') {
        updateProgress();
    }
    if (typeof updateLivePreview === 'function') {
        updateLivePreview();
    }
}

/**
 * Proceed to Step 4 (Preview & Generate)
 */
function proceedToStep4() {
    goToStep(4);
    
    // Update final summary
    updateFinalSummary();
}

/**
 * Update DREAM target summary display
 */
function updateDreamTargetSummary() {
    const cohort = document.getElementById('dreamCohort')?.value || '';
    const company = document.getElementById('dreamCompany')?.value || '';
    const role = document.getElementById('dreamRole')?.value || '';
    const tech = document.getElementById('dreamTech')?.value || '';
    
    const summaryEl = document.getElementById('dreamTargetSummary');
    if (summaryEl) {
        summaryEl.textContent = `${role} at ${company} (${cohort})`;
    }
}

/**
 * Update final summary for Step 4
 */
function updateFinalSummary() {
    const cohort = document.getElementById('dreamCohort')?.value || '';
    const company = document.getElementById('dreamCompany')?.value || '';
    const role = document.getElementById('dreamRole')?.value || '';
    const tech = document.getElementById('dreamTech')?.value || '';
    const pkg = document.querySelector('input[name="expected_package"]')?.value || '';
    
    const summaryCard = document.getElementById('dreamSummaryCard');
    if (summaryCard) {
        summaryCard.innerHTML = `
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Role:</strong> ${role}</p>
            <p><strong>Cohort:</strong> ${cohort}</p>
            <p><strong>Technology:</strong> ${tech}</p>
            ${pkg ? `<p><strong>Package:</strong> ${pkg}</p>` : ''}
        `;
    }
    
    // Update progress bar
    updateFinalProgress();
}

/**
 * Update final progress display
 */
function updateFinalProgress() {
    const data = typeof collectFormData === 'function' ? collectFormData() : {};
    
    let completedSections = 0;
    const totalSections = 10;
    
    // Check each major section
    if (data.full_name && data.email && data.phone) completedSections++;
    if (data.dream_company && data.target_role) completedSections++;
    if (data.qualifications && data.qualifications.length > 0) completedSections++;
    if (data.prog_languages || data.web_tech) completedSections++;
    if (data.internships && data.internships.length > 0) completedSections++;
    if (data.projects && data.projects.length > 0) completedSections++;
    if (data.certifications && data.certifications.length > 0) completedSections++;
    if (data.responsibilities && data.responsibilities.length > 0) completedSections++;
    if (data.languages && data.languages.length > 0) completedSections++;
    if (data.professional_summary) completedSections++;
    
    const percentage = Math.round((completedSections / totalSections) * 100);
    
    const progressBar = document.getElementById('finalProgressBar');
    const sectionsText = document.getElementById('sectionsCompleted');
    
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        progressBar.textContent = `${percentage}%`;
    }
    
    if (sectionsText) {
        sectionsText.textContent = `Sections completed: ${completedSections}/${totalSections}`;
    }
}

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

/**
 * Get current DREAM details for context
 */
function getDreamContext() {
    return {
        cohort: document.getElementById('dreamCohort')?.value || '',
        dream_company: document.getElementById('dreamCompany')?.value || '',
        target_role: document.getElementById('dreamRole')?.value || '',
        target_technology: document.getElementById('dreamTech')?.value || '',
        expected_package: document.querySelector('input[name="expected_package"]')?.value || ''
    };
}

// ===== GLOBAL FUNCTION EXPORTS =====
window.goToStep = goToStep;
window.proceedToStep2 = proceedToStep2;
window.proceedToStep3 = proceedToStep3;
window.proceedToStep4 = proceedToStep4;
window.getDreamContext = getDreamContext;
window.updateDreamTargetSummary = updateDreamTargetSummary;
window.updateFinalSummary = updateFinalSummary;
window.currentStep = currentStep;
window.dreamDetailsCompleted = dreamDetailsCompleted;
