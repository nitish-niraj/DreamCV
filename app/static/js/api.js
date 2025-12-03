// DREAM CV Generator - API Module (AI & PDF Operations)

// ===== NATURAL LANGUAGE INPUT =====

let currentNLSection = 'project';

/**
 * Open the natural language input modal for a section
 * @param {string} sectionType - Type: 'project', 'experience', 'certification', 'skill'
 */
function openNaturalLanguageModal(sectionType) {
    currentNLSection = sectionType;
    document.getElementById('nlSectionType').value = sectionType;
    document.getElementById('nlUserInput').value = '';
    
    const placeholders = {
        'project': 'Example: I made a website for my college fest where students could register online. I used React for frontend and Node.js for backend. Around 500 students registered through it.',
        'experience': 'Example: I worked at a startup as an intern for 3 months. I helped build their mobile app using Flutter and fixed bugs. The app got 1000+ downloads.',
        'certification': 'Example: I completed a course on machine learning from Coursera. It was taught by Andrew Ng and took me 2 months to finish.',
        'skill': 'Example: I know Python, JavaScript, and can work with React. I also use Git and have some experience with Docker.'
    };
    
    document.getElementById('nlUserInput').placeholder = placeholders[sectionType] || placeholders['project'];
    
    const modal = new bootstrap.Modal(document.getElementById('naturalLanguageModal'));
    modal.show();
}

/**
 * Process natural language input and add formatted entry
 */
function processNaturalLanguage() {
    const sectionType = document.getElementById('nlSectionType').value;
    const userInput = document.getElementById('nlUserInput').value.trim();
    
    if (!userInput) {
        showNotification('Please enter some text to process', 'warning');
        return;
    }
    
    showLoading('AI is formatting your input...');
    
    fetch('/format_natural_language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            section_type: sectionType,
            user_input: userInput
        })
    })
    .then(response => response.json())
    .then(result => {
        if (result.success && result.formatted) {
            addFormattedEntry(sectionType, result.formatted);
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('naturalLanguageModal'));
            if (modal) modal.hide();
            
            showNotification('✨ AI has formatted and added your entry!', 'success');
            updateProgress();
            updateLivePreview();
        } else {
            showNotification('Could not format input. Please try again.', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Error processing input', 'error');
    })
    .finally(() => {
        hideLoading();
    });
}

/**
 * Add a formatted entry to the appropriate section
 * @param {string} sectionType - The section type
 * @param {Object} data - The formatted data
 */
function addFormattedEntry(sectionType, data) {
    switch(sectionType) {
        case 'project':
            addProject();
            const projEntries = document.querySelectorAll('.project-entry');
            const lastProj = projEntries[projEntries.length - 1];
            if (data.name) lastProj.querySelector('input[name="proj_name[]"]').value = data.name;
            if (data.role) lastProj.querySelector('input[name="proj_role[]"]').value = data.role;
            if (data.description) lastProj.querySelector('textarea[name="proj_description[]"]').value = data.description;
            if (data.tech) lastProj.querySelector('input[name="proj_tech[]"]').value = data.tech;
            break;
            
        case 'experience':
            addExperience();
            const expEntries = document.querySelectorAll('.experience-entry');
            const lastExp = expEntries[expEntries.length - 1];
            if (data.company) lastExp.querySelector('input[name="exp_company[]"]').value = data.company;
            if (data.role) lastExp.querySelector('input[name="exp_role[]"]').value = data.role;
            if (data.duration) lastExp.querySelector('input[name="exp_duration[]"]').value = data.duration;
            if (data.responsibilities) lastExp.querySelector('textarea[name="exp_responsibilities[]"]').value = data.responsibilities;
            break;
            
        case 'certification':
            addCertification();
            const certEntries = document.querySelectorAll('.certification-entry');
            const lastCert = certEntries[certEntries.length - 1];
            if (data.title) lastCert.querySelector('input[name="cert_title[]"]').value = data.title;
            if (data.source) lastCert.querySelector('input[name="cert_source[]"]').value = data.source;
            if (data.duration) lastCert.querySelector('input[name="cert_duration[]"]').value = data.duration;
            if (data.type) lastCert.querySelector('select[name="cert_type[]"]').value = data.type;
            break;
            
        case 'skill':
            if (data.prog_languages) document.querySelector('input[name="prog_languages"]').value = data.prog_languages;
            if (data.web_tech) document.querySelector('input[name="web_tech"]').value = data.web_tech;
            if (data.databases) document.querySelector('input[name="databases"]').value = data.databases;
            if (data.mobile_tech) document.querySelector('input[name="mobile_tech"]').value = data.mobile_tech;
            if (data.other_tools) document.querySelector('input[name="other_tools"]').value = data.other_tools;
            break;
    }
}


// ===== AI CAREER OBJECTIVE GENERATION =====

/**
 * Generate career objective using AI based on form data
 * Uses 50% dream company details + 50% resume content
 */
function generateCareerObjective() {
    const btn = document.getElementById('generateCareerObjective');
    const textarea = document.getElementById('professional_summary');
    const originalText = btn.innerHTML;
    
    const form = document.getElementById('cvForm');
    const formData = new FormData(form);
    
    // Collect all relevant data for balanced career objective
    const data = {
        // Dream Company Details (50%)
        name: formData.get('full_name') || '',
        dream_company: formData.get('dream_company') || '',
        target_role: formData.get('target_role') || '',
        target_technology: formData.get('target_technology') || '',
        cohort: formData.get('cohort') || '',
        
        // Resume-based Details (50%)
        technical_skills: [
            formData.get('prog_languages'),
            formData.get('web_tech'),
            formData.get('databases'),
            formData.get('mobile_tech'),
            formData.get('other_tools')
        ].filter(Boolean).join(', '),
        work_experience: collectWorkExperiencesForAI(),
        projects: collectProjectsForAI(),
        education: collectEducationForAI(),
        achievements: formData.get('achievements') || ''
    };
    
    // Validate that we have at least some data
    if (!data.dream_company && !data.target_role) {
        showNotification('Please fill in Dream Company details first!', 'warning');
        return;
    }
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    btn.disabled = true;
    
    fetch('/generate_career_objective', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            textarea.value = result.career_objective;
            showNotification('Career objective generated successfully!', 'success');
            updateLivePreview();
        } else {
            showNotification('Error: ' + (result.error || 'Failed to generate'), 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Error generating career objective', 'error');
    })
    .finally(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
    });
}

// Helper functions for AI context
function collectWorkExperiencesForAI() {
    const experiences = [];
    document.querySelectorAll('.experience-entry').forEach(entry => {
        const title = entry.querySelector('[name="exp_role[]"]')?.value || '';
        const company = entry.querySelector('[name="exp_company[]"]')?.value || '';
        if (title || company) {
            experiences.push(`${title} at ${company}`);
        }
    });
    return experiences.join('; ');
}

function collectProjectsForAI() {
    const projects = [];
    document.querySelectorAll('.project-entry').forEach(entry => {
        const name = entry.querySelector('[name="proj_name[]"]')?.value || '';
        if (name) projects.push(name);
    });
    return projects.join(', ');
}

function collectEducationForAI() {
    const education = [];
    document.querySelectorAll('.qualification-entry').forEach(entry => {
        const degree = entry.querySelector('[name="qual_degree[]"]')?.value || '';
        const institution = entry.querySelector('[name="qual_institution[]"]')?.value || '';
        if (degree || institution) {
            education.push(`${degree} from ${institution}`);
        }
    });
    return education.join('; ');
}


// ===== AI SECTION FORMATTING =====

/**
 * Format a section using AI
 * @param {string} sectionName - The section to format
 */
function formatSection(sectionName) {
    const data = collectFormData();
    let content = '';
    
    if (sectionName === 'technical_skills') {
        content = `Programming Languages: ${data.prog_languages}\nWeb Technologies: ${data.web_tech}\nDatabases: ${data.databases}\nMobile: ${data.mobile_tech}\nTools: ${data.other_tools}`;
    } else if (sectionName === 'projects') {
        content = data.projects.map(p => `Project: ${p.name}, Role: ${p.role}, Description: ${p.description}, Tech: ${p.tech}`).join('\n');
    }
    
    showLoading('Formatting with AI...');
    
    fetch('/format_section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            section_name: sectionName,
            content: content
        })
    })
    .then(response => response.json())
    .then(result => {
        if (result.formatted) {
            showNotification('Section formatted! Check the suggestions panel for improvements.', 'success');
            document.getElementById('suggestionsContent').innerHTML = `
                <h6>AI Formatted ${sectionName.replace('_', ' ').toUpperCase()}</h6>
                <div class="p-3 bg-light rounded">${result.formatted.replace(/\n/g, '<br>')}</div>
            `;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Error formatting section', 'error');
    })
    .finally(() => {
        hideLoading();
    });
}


// ===== AI SUGGESTIONS =====

/**
 * Get AI suggestions for CV improvement
 */
function getSuggestions() {
    const data = collectFormData();
    
    if (!data.dream_company || !data.target_role) {
        showNotification('Please fill in the DREAM Company details first!', 'warning');
        return;
    }
    
    showLoading('Getting AI suggestions...');
    
    fetch('/get_suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.suggestions) {
            // Clean up any JSON-like formatting from suggestions
            let cleanedSuggestions = result.suggestions
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .replace(/^\s*\{[\s\S]*\}\s*$/g, '')
                .replace(/\[[^\]]*\]/g, '')
                .trim();
            
            if (cleanedSuggestions.includes('{') || cleanedSuggestions.includes('}')) {
                cleanedSuggestions = cleanedSuggestions
                    .replace(/[{}"'\[\]:,]/g, '')
                    .replace(/\n\s*\n/g, '\n')
                    .trim();
            }
            
            // Convert markdown to HTML for rich text display
            const richTextSuggestions = markdownToHtml(cleanedSuggestions);
            
            document.getElementById('suggestionsContent').innerHTML = `
                <div class="suggestions-list">
                    ${richTextSuggestions}
                </div>
            `;
            showNotification('AI suggestions generated!', 'success');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Error getting suggestions', 'error');
    })
    .finally(() => {
        hideLoading();
    });
}


// ===== PDF GENERATION =====

/**
 * Generate and download PDF CV
 */
function generatePDF() {
    const data = collectFormData();
    
    if (!data.full_name || !data.email || !data.dream_company) {
        showNotification('Please fill in all required fields (Name, Email, Dream Company)', 'warning');
        return;
    }
    
    showLoading('Generating PDF...');
    
    fetch('/generate_pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('PDF generation failed');
        }
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `DREAM_CV_${data.full_name.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        
        showNotification('PDF generated successfully!', 'success');
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Error generating PDF. Please try again.', 'error');
    })
    .finally(() => {
        hideLoading();
    });
}


// Export API functions
window.CVAPI = {
    openNaturalLanguageModal,
    processNaturalLanguage,
    generateCareerObjective,
    formatSection,
    getSuggestions,
    generatePDF
};

// Expose generateCareerObjective globally for form.js
window.generateCareerObjective = generateCareerObjective;
