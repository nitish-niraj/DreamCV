// DREAM CV Generator - Upload Module (Resume & Photo)

// ===== STATE VARIABLES =====
let isUploading = false;
let uploadController = null;

// ===== RESUME UPLOAD & DRAG-DROP =====

/**
 * Initialize the drag-drop zone for resume upload
 */
function initDragDropZone() {
    const dropZone = document.getElementById('resumeDropZone');
    const resumeUpload = document.getElementById('resumeUpload');
    
    if (!dropZone || !resumeUpload) return;
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('drag-over');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('drag-over');
        }, false);
    });
    
    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);
    
    // Only trigger on click if not already handled by button
    dropZone.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
            resumeUpload.click();
        }
    });
    
    // Handle file selection
    resumeUpload.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            handleResumeUpload(e.target.files[0]);
        }
    });
}

/**
 * Handle dropped files
 * @param {DragEvent} e - The drop event
 */
function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
        handleResumeUpload(files[0]);
    }
}

/**
 * Handle resume file upload and parsing
 * @param {File} file - The uploaded file
 */
function handleResumeUpload(file) {
    // Prevent duplicate uploads
    if (isUploading) {
        console.log('[DEBUG] Upload already in progress, ignoring');
        return;
    }
    
    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 
                       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                       'text/plain'];
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
        showNotification('Please upload a PDF, DOC, DOCX, or TXT file', 'error');
        return;
    }
    
    isUploading = true;
    console.log('[DEBUG] Starting resume upload:', file.name);
    
    // Show progress with better UI
    const uploadProgress = document.getElementById('uploadProgress');
    const progressBar = document.querySelector('#uploadProgress .progress-bar');
    const progressText = document.querySelector('#uploadProgress p');
    
    uploadProgress.style.display = 'block';
    progressBar.style.width = '10%';
    progressBar.classList.add('bg-primary');
    
    // Animated progress simulation
    let progress = 10;
    const progressInterval = setInterval(() => {
        if (progress < 90) {
            progress += Math.random() * 15;
            progressBar.style.width = Math.min(progress, 90) + '%';
        }
    }, 500);
    
    // Get DREAM context for tailored parsing
    const dreamContext = typeof getDreamContext === 'function' ? getDreamContext() : {};
    
    // Upload and parse with DREAM context
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('dream_context', JSON.stringify(dreamContext));
    
    fetch('/parse_resume', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('[DEBUG] Response status:', response.status);
        return response.json();
    })
    .then(data => {
        clearInterval(progressInterval);
        console.log('[DEBUG] Response data:', data);
        
        if (data.success && data.data) {
            progressBar.style.width = '100%';
            progressBar.classList.remove('bg-primary');
            progressBar.classList.add('bg-success');
            if (progressText) progressText.innerHTML = '<i class="fas fa-check-circle"></i> Resume parsed successfully!';
            
            setTimeout(() => {
                uploadProgress.style.display = 'none';
                progressBar.style.width = '0%';
                progressBar.classList.remove('bg-success');
                progressBar.classList.add('bg-primary');
                if (progressText) progressText.innerHTML = '<i class="fas fa-robot"></i> AI is analyzing your resume...';
                
                // Auto-fill form with parsed data
                autoFillFormFromResume(data.data);
                
                // Show dream-aligned message
                const dreamCompany = dreamContext.dream_company || 'your dream company';
                showNotification(`✨ Resume parsed and aligned with ${dreamCompany}! AI has filled in your details.`, 'success');
                
                // DON'T scroll - stay on step 2 so user can proceed
                isUploading = false;
            }, 800);
        } else {
            handleUploadError(progressInterval, progressBar, progressText, uploadProgress, data.error);
        }
    })
    .catch(error => {
        handleUploadFailure(progressInterval, progressBar, progressText, uploadProgress, error);
    });
    
    // Clear file input to allow re-upload of same file
    document.getElementById('resumeUpload').value = '';
}

/**
 * Handle upload error (parsing failed)
 */
function handleUploadError(progressInterval, progressBar, progressText, uploadProgress, errorMsg) {
    clearInterval(progressInterval);
    progressBar.style.width = '100%';
    progressBar.classList.remove('bg-primary');
    progressBar.classList.add('bg-warning');
    if (progressText) progressText.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Could not parse resume';
    
    setTimeout(() => {
        uploadProgress.style.display = 'none';
        progressBar.style.width = '0%';
        progressBar.classList.remove('bg-warning');
        progressBar.classList.add('bg-primary');
        if (progressText) progressText.innerHTML = '<i class="fas fa-robot"></i> AI is analyzing your resume...';
        isUploading = false;
    }, 1500);
    
    showNotification(errorMsg || 'Could not parse resume. Please fill manually.', 'warning');
}

/**
 * Handle upload failure (network error)
 */
function handleUploadFailure(progressInterval, progressBar, progressText, uploadProgress, error) {
    clearInterval(progressInterval);
    console.error('[ERROR] Upload error:', error);
    
    progressBar.style.width = '100%';
    progressBar.classList.remove('bg-primary');
    progressBar.classList.add('bg-danger');
    if (progressText) progressText.innerHTML = '<i class="fas fa-times-circle"></i> Error uploading resume';
    
    setTimeout(() => {
        uploadProgress.style.display = 'none';
        progressBar.style.width = '0%';
        progressBar.classList.remove('bg-danger');
        progressBar.classList.add('bg-primary');
        if (progressText) progressText.innerHTML = '<i class="fas fa-robot"></i> AI is analyzing your resume...';
        isUploading = false;
    }, 1500);
    
    showNotification('Error uploading resume. Please try again.', 'error');
}

/**
 * Auto-fill form fields from parsed resume data
 * @param {Object} data - Parsed resume data
 */
function autoFillFormFromResume(data) {
    console.log('[DEBUG] Auto-filling form with data:', data);
    
    // Track extracted and remaining sections
    const extractedSections = [];
    const remainingSections = [];
    
    // Define all sections to check
    const sectionChecks = {
        'Personal Details': () => data.full_name || data.email || data.phone,
        'Contact Links': () => data.linkedin || data.github || data.portfolio,
        'Professional Summary': () => data.professional_summary,
        'Technical Skills': () => data.prog_languages || data.web_tech || data.databases || data.mobile_tech || data.other_tools,
        'Education': () => data.qualifications && data.qualifications.length > 0,
        'Work Experience': () => data.experiences && data.experiences.length > 0,
        'Internships': () => data.internships && data.internships.length > 0,
        'Projects': () => data.projects && data.projects.length > 0,
        'Certifications': () => data.certifications && data.certifications.length > 0,
        'Responsibilities': () => data.responsibilities && data.responsibilities.length > 0,
        'Languages': () => data.languages && data.languages.length > 0,
        'Achievements': () => data.achievements_list || data.achievements,
        'Community Activities': () => data.community_activities,
        'Technical Events': () => data.tech_events,
        'Digital Profiles': () => data.leetcode || data.gfg || data.hackerrank || data.codeforces || data.codechef || data.kaggle
    };
    
    // Check each section
    for (const [section, checkFn] of Object.entries(sectionChecks)) {
        if (checkFn()) {
            extractedSections.push(section);
        } else {
            remainingSections.push(section);
        }
    }
    
    // ===== BASIC PERSONAL DETAILS =====
    setFieldValue('input[name="full_name"]', data.full_name);
    setFieldValue('input[name="email"]', data.email);
    setFieldValue('input[name="phone"]', data.phone);
    setFieldValue('input[name="address"]', data.address);
    
    // ===== CONTACT LINKS =====
    setFieldValue('input[name="linkedin"]', data.linkedin);
    setFieldValue('input[name="github"]', data.github);
    setFieldValue('input[name="skype"]', data.skype);
    setFieldValue('input[name="portfolio"]', data.portfolio);
    
    // ===== PROFESSIONAL SUMMARY =====
    setFieldValue('textarea[name="professional_summary"]', data.professional_summary);
    
    // ===== TECHNICAL SKILLS =====
    setFieldValue('input[name="prog_languages"]', data.prog_languages);
    setFieldValue('input[name="web_tech"]', data.web_tech);
    setFieldValue('input[name="databases"]', data.databases);
    setFieldValue('input[name="mobile_tech"]', data.mobile_tech);
    setFieldValue('input[name="other_tools"]', data.other_tools);
    
    // ===== QUALIFICATIONS =====
    if (data.qualifications && data.qualifications.length > 0) {
        fillQualifications(data.qualifications);
    }
    
    // ===== INTERNSHIPS =====
    if (data.internships && data.internships.length > 0) {
        fillInternships(data.internships);
    }
    
    // ===== CERTIFICATIONS =====
    if (data.certifications && data.certifications.length > 0) {
        fillCertifications(data.certifications);
    }
    
    // ===== PROJECTS =====
    if (data.projects && data.projects.length > 0) {
        fillProjects(data.projects);
    }
    
    // ===== WORK EXPERIENCES =====
    if (data.experiences && data.experiences.length > 0) {
        fillExperiences(data.experiences);
    }
    
    // ===== RESPONSIBILITIES =====
    if (data.responsibilities && data.responsibilities.length > 0) {
        fillResponsibilities(data.responsibilities);
    }
    
    // ===== LANGUAGES =====
    if (data.languages && data.languages.length > 0) {
        fillLanguages(data.languages);
    }
    
    // ===== DIGITAL EXISTENCE - ALL CODING PLATFORMS =====
    // LeetCode
    setFieldValue('input[name="leetcode"]', data.leetcode);
    // GeeksforGeeks  
    setFieldValue('input[name="gfg"]', data.gfg);
    // InterviewBit
    setFieldValue('input[name="interviewbit"]', data.interviewbit);
    // Codeforces
    setFieldValue('input[name="codeforces"]', data.codeforces);
    // CodeChef
    setFieldValue('input[name="codechef"]', data.codechef);
    // AtCoder
    setFieldValue('input[name="atcoder"]', data.atcoder);
    // HackerRank
    setFieldValue('input[name="hackerrank"]', data.hackerrank);
    // HackerEarth
    setFieldValue('input[name="hackerearth"]', data.hackerearth);
    // Codility
    setFieldValue('input[name="codility"]', data.codility);
    // CodeSignal
    setFieldValue('input[name="codesignal"]', data.codesignal);
    // Kaggle
    setFieldValue('input[name="kaggle"]', data.kaggle);
    // HuggingFace
    setFieldValue('input[name="huggingface"]', data.huggingface);
    
    // ===== COMMUNITY ASSOCIATIONS =====
    setFieldValue('input[name="community_associations"]', data.community_associations);
    
    // ===== EXTRA CURRICULAR - COMMUNITY ACTIVITIES =====
    if (data.community_activities) {
        fillCommunityActivities(data.community_activities);
    }
    
    // ===== EXTRA CURRICULAR - ACHIEVEMENTS =====
    if (data.achievements_list || data.achievements) {
        fillAchievements(data.achievements_list || data.achievements);
    }
    
    // ===== TECHNICAL EVENTS =====
    if (data.tech_events) {
        fillTechEvents(data.tech_events);
    }
    
    // Show extraction status panel
    showExtractionStatus(extractedSections, remainingSections);
    
    // Update progress and preview
    updateProgress();
    updateLivePreview();
    
    // ===== AUTO-ALIGN WITH DREAM DETAILS =====
    // Delay slightly to ensure form is fully populated
    setTimeout(() => {
        if (typeof alignFormWithDreamDetails === 'function') {
            alignFormWithDreamDetails();
        }
    }, 500);
    
    console.log('[DEBUG] Form auto-fill complete!');
    console.log('[DEBUG] Extracted:', extractedSections);
    console.log('[DEBUG] Remaining:', remainingSections);
}

/**
 * Helper function to safely set field value
 */
function setFieldValue(selector, value) {
    if (!value) return;
    const element = document.querySelector(selector);
    if (element) {
        element.value = value;
    }
}

/**
 * Fill community activities as bullet points
 */
function fillCommunityActivities(activities) {
    const container = document.getElementById('communityActivitiesList');
    if (!container) return;
    
    // Convert to array if string
    let activityList = activities;
    if (typeof activities === 'string') {
        activityList = activities.split(/[,\n•\-]/).map(a => a.trim()).filter(a => a.length > 0);
    }
    
    if (!Array.isArray(activityList) || activityList.length === 0) return;
    
    // Clear existing and fill first input
    const existingInputs = container.querySelectorAll('input[name="community_activity[]"]');
    if (existingInputs.length > 0 && activityList.length > 0) {
        existingInputs[0].value = activityList[0];
    }
    
    // Add additional activities
    for (let i = 1; i < activityList.length; i++) {
        if (activityList[i].trim()) {
            addCommunityActivity();
            const inputs = container.querySelectorAll('input[name="community_activity[]"]');
            const lastInput = inputs[inputs.length - 1];
            if (lastInput) {
                lastInput.value = activityList[i].trim();
            }
        }
    }
}

/**
 * Fill achievements as bullet points
 */
function fillAchievements(achievements) {
    const container = document.getElementById('achievementsList');
    if (!container) return;
    
    // Convert to array if string
    let achievementList = achievements;
    if (typeof achievements === 'string') {
        achievementList = achievements.split(/[,\n•\-]/).map(a => a.trim()).filter(a => a.length > 0);
    }
    
    if (!Array.isArray(achievementList) || achievementList.length === 0) return;
    
    // Clear existing and fill first input
    const existingInputs = container.querySelectorAll('input[name="achievement[]"]');
    if (existingInputs.length > 0 && achievementList.length > 0) {
        existingInputs[0].value = achievementList[0];
    }
    
    // Add additional achievements
    for (let i = 1; i < achievementList.length; i++) {
        if (achievementList[i].trim()) {
            addAchievement();
            const inputs = container.querySelectorAll('input[name="achievement[]"]');
            const lastInput = inputs[inputs.length - 1];
            if (lastInput) {
                lastInput.value = achievementList[i].trim();
            }
        }
    }
}

/**
 * Fill tech events as bullet points
 */
function fillTechEvents(events) {
    const container = document.getElementById('techEventsList');
    if (!container) return;
    
    // Convert to array if string
    let eventList = events;
    if (typeof events === 'string') {
        eventList = events.split(/[,\n•\-]/).map(e => e.trim()).filter(e => e.length > 0);
    }
    
    if (!Array.isArray(eventList) || eventList.length === 0) return;
    
    // Clear existing and fill first input
    const existingInputs = container.querySelectorAll('input[name="tech_event[]"]');
    if (existingInputs.length > 0 && eventList.length > 0) {
        existingInputs[0].value = eventList[0];
    }
    
    // Add additional events
    for (let i = 1; i < eventList.length; i++) {
        if (eventList[i].trim()) {
            addTechEvent();
            const inputs = container.querySelectorAll('input[name="tech_event[]"]');
            const lastInput = inputs[inputs.length - 1];
            if (lastInput) {
                lastInput.value = eventList[i].trim();
            }
        }
    }
}

/**
 * Show extraction status panel
 * @param {Array} extracted - List of extracted sections
 * @param {Array} remaining - List of remaining sections
 */
function showExtractionStatus(extracted, remaining) {
    const statusPanel = document.getElementById('extractionStatus');
    const extractedList = document.getElementById('extractedSections');
    const remainingList = document.getElementById('remainingSections');
    
    if (!statusPanel || !extractedList || !remainingList) return;
    
    // Clear previous content
    extractedList.innerHTML = '';
    remainingList.innerHTML = '';
    
    // Populate extracted sections
    extracted.forEach(section => {
        const li = document.createElement('li');
        li.textContent = section;
        extractedList.appendChild(li);
    });
    
    // Populate remaining sections
    remaining.forEach(section => {
        const li = document.createElement('li');
        li.textContent = section;
        remainingList.appendChild(li);
    });
    
    // Show the panel
    statusPanel.style.display = 'block';
}

// Helper functions for filling dynamic entries
function fillQualifications(qualifications) {
    const container = document.getElementById('qualificationsList');
    if (!container) return;
    
    container.innerHTML = '';
    qualifications.forEach((qual) => {
        addQualification();
        const entries = container.querySelectorAll('.qualification-entry');
        const entry = entries[entries.length - 1];
        if (entry) {
            setEntryField(entry, 'input[name="qual_degree[]"]', qual.degree);
            setEntryField(entry, 'input[name="qual_institution[]"]', qual.institution);
            setEntryField(entry, 'input[name="qual_board[]"]', qual.board);
            setEntryField(entry, 'input[name="qual_year[]"]', qual.year);
            setEntryField(entry, 'input[name="qual_score[]"]', qual.score);
            setEntryField(entry, 'input[name="qual_duration[]"]', qual.duration);
        }
    });
}

function fillInternships(internships) {
    const container = document.getElementById('internshipsList');
    if (!container) return;
    
    container.innerHTML = '';
    internships.forEach((intern) => {
        addInternship();
        const entries = container.querySelectorAll('.internship-entry');
        const entry = entries[entries.length - 1];
        if (entry) {
            setEntryField(entry, 'input[name="intern_company[]"]', intern.company);
            setEntryField(entry, 'input[name="intern_role[]"]', intern.role);
            setEntryField(entry, 'input[name="intern_duration[]"]', intern.duration);
            
            // Set mode dropdown
            const modeSelect = entry.querySelector('select[name="intern_mode[]"]');
            if (modeSelect && intern.mode) {
                modeSelect.value = intern.mode;
            }
            
            // Fill bullet points from bullets array
            const bulletInputs = [
                entry.querySelector('input[name="intern_bullet1[]"]'),
                entry.querySelector('input[name="intern_bullet2[]"]'),
                entry.querySelector('input[name="intern_bullet3[]"]'),
                entry.querySelector('input[name="intern_bullet4[]"]')
            ];
            
            if (intern.bullets && Array.isArray(intern.bullets)) {
                intern.bullets.forEach((bullet, idx) => {
                    if (bulletInputs[idx] && bullet) {
                        bulletInputs[idx].value = bullet;
                    }
                });
            }
            // Fallback: if description/responsibilities string exists, split into bullets
            else if (intern.description || intern.responsibilities) {
                const descText = intern.description || intern.responsibilities;
                const bullets = splitIntoBullets(descText);
                bullets.forEach((bullet, idx) => {
                    if (bulletInputs[idx] && bullet) {
                        bulletInputs[idx].value = bullet;
                    }
                });
            }
        }
    });
}

function fillCertifications(certifications) {
    const container = document.getElementById('certificationsList');
    if (!container) return;
    
    container.innerHTML = '';
    certifications.forEach((cert) => {
        addCertification();
        const entries = container.querySelectorAll('.certification-entry');
        const entry = entries[entries.length - 1];
        if (entry) {
            setEntryField(entry, 'input[name="cert_title[]"]', cert.title);
            setEntryField(entry, 'input[name="cert_source[]"]', cert.source);
            setEntryField(entry, 'input[name="cert_date[]"]', cert.date);
            setEntryField(entry, 'input[name="cert_id[]"]', cert.credential_id);
            
            // Set type dropdown
            const typeSelect = entry.querySelector('select[name="cert_type[]"]');
            if (typeSelect && cert.type) {
                typeSelect.value = cert.type;
            }
        }
    });
}

function fillProjects(projects) {
    const container = document.getElementById('projectsList');
    if (!container) return;
    
    container.innerHTML = '';
    projects.forEach((proj) => {
        addProject();
        const entries = container.querySelectorAll('.project-entry');
        const entry = entries[entries.length - 1];
        if (entry) {
            setEntryField(entry, 'input[name="proj_name[]"]', proj.name);
            setEntryField(entry, 'input[name="proj_role[]"]', proj.role);
            setEntryField(entry, 'input[name="proj_tech[]"]', proj.tech);
            
            // Fill bullet points from bullets array
            const bulletInputs = [
                entry.querySelector('input[name="proj_bullet1[]"]'),
                entry.querySelector('input[name="proj_bullet2[]"]'),
                entry.querySelector('input[name="proj_bullet3[]"]'),
                entry.querySelector('input[name="proj_bullet4[]"]')
            ];
            
            if (proj.bullets && Array.isArray(proj.bullets)) {
                proj.bullets.forEach((bullet, idx) => {
                    if (bulletInputs[idx] && bullet) {
                        bulletInputs[idx].value = bullet;
                    }
                });
            }
            // Fallback: if description string exists, split into bullets
            else if (proj.description) {
                const bullets = splitIntoBullets(proj.description);
                bullets.forEach((bullet, idx) => {
                    if (bulletInputs[idx] && bullet) {
                        bulletInputs[idx].value = bullet;
                    }
                });
            }
        }
    });
}

function fillExperiences(experiences) {
    const container = document.getElementById('experiencesList');
    if (!container) return;
    
    container.innerHTML = '';
    experiences.forEach((exp) => {
        addExperience();
        const entries = container.querySelectorAll('.experience-entry');
        const entry = entries[entries.length - 1];
        if (entry) {
            setEntryField(entry, 'input[name="exp_company[]"]', exp.company);
            setEntryField(entry, 'input[name="exp_role[]"]', exp.role);
            setEntryField(entry, 'input[name="exp_duration[]"]', exp.duration);
            setEntryField(entry, 'input[name="exp_salary[]"]', exp.salary);
            
            // Fill bullet points from bullets array
            const bulletInputs = [
                entry.querySelector('input[name="exp_bullet1[]"]'),
                entry.querySelector('input[name="exp_bullet2[]"]'),
                entry.querySelector('input[name="exp_bullet3[]"]'),
                entry.querySelector('input[name="exp_bullet4[]"]')
            ];
            
            if (exp.bullets && Array.isArray(exp.bullets)) {
                exp.bullets.forEach((bullet, idx) => {
                    if (bulletInputs[idx] && bullet) {
                        bulletInputs[idx].value = bullet;
                    }
                });
            }
            // Fallback: if responsibilities string exists, split into bullets
            else if (exp.responsibilities) {
                const bullets = splitIntoBullets(exp.responsibilities);
                bullets.forEach((bullet, idx) => {
                    if (bulletInputs[idx] && bullet) {
                        bulletInputs[idx].value = bullet;
                    }
                });
            }
        }
    });
}

function fillResponsibilities(responsibilities) {
    const container = document.getElementById('responsibilitiesList');
    if (!container) return;
    
    container.innerHTML = '';
    responsibilities.forEach((resp) => {
        addResponsibility();
        const entries = container.querySelectorAll('.responsibility-entry');
        const entry = entries[entries.length - 1];
        if (entry) {
            setEntryField(entry, 'input[name="resp_role[]"]', resp.role);
            setEntryField(entry, 'input[name="resp_org[]"]', resp.organization);
            setEntryField(entry, 'input[name="resp_duration[]"]', resp.duration);
            
            // Fill bullet points from bullets array
            const bulletInputs = [
                entry.querySelector('input[name="resp_bullet1[]"]'),
                entry.querySelector('input[name="resp_bullet2[]"]'),
                entry.querySelector('input[name="resp_bullet3[]"]')
            ];
            
            if (resp.bullets && Array.isArray(resp.bullets)) {
                resp.bullets.forEach((bullet, idx) => {
                    if (bulletInputs[idx] && bullet) {
                        bulletInputs[idx].value = bullet;
                    }
                });
            }
            // Fallback: if description string exists, split into bullets
            else if (resp.description) {
                const bullets = splitIntoBullets(resp.description);
                bullets.forEach((bullet, idx) => {
                    if (bulletInputs[idx] && bullet) {
                        bulletInputs[idx].value = bullet;
                    }
                });
            }
        }
    });
}

/**
 * Helper to set field value within an entry
 */
function setEntryField(entry, selector, value) {
    if (!value) return;
    const field = entry.querySelector(selector);
    if (field) {
        field.value = value;
    }
}

/**
 * Helper to split text into bullet points
 */
function splitIntoBullets(text) {
    if (!text) return [];
    return text.split(/[•\-\n\r]+/)
        .map(b => b.trim())
        .filter(b => b.length > 0)
        .slice(0, 4); // Max 4 bullets
}

function fillLanguages(languages) {
    const container = document.getElementById('languagesList');
    if (!container) return;
    
    container.innerHTML = '';
    languages.forEach((lang) => {
        addLanguage();
        const entries = container.querySelectorAll('.language-entry');
        const entry = entries[entries.length - 1];
        if (entry && lang.name) {
            entry.querySelector('input[name="lang_name[]"]').value = lang.name;
            
            // Parse abilities from string or object
            const abilities = typeof lang.abilities === 'string' ? lang.abilities.toLowerCase() : '';
            const canSpeak = lang.speak || abilities.includes('speak') || abilities.includes('verbal') || abilities.includes('fluent') || abilities.includes('native');
            const canWrite = lang.write || abilities.includes('write') || abilities.includes('written') || abilities.includes('fluent') || abilities.includes('native');
            const canRead = lang.read || abilities.includes('read') || abilities.includes('fluent') || abilities.includes('native') || abilities.includes('professional');
            
            const speakCheckbox = entry.querySelector('input[name="lang_speak[]"]');
            const writeCheckbox = entry.querySelector('input[name="lang_write[]"]');
            const readCheckbox = entry.querySelector('input[name="lang_read[]"]');
            
            if (speakCheckbox && canSpeak) speakCheckbox.checked = true;
            if (writeCheckbox && canWrite) writeCheckbox.checked = true;
            if (readCheckbox && canRead) readCheckbox.checked = true;
        }
    });
}


// ===== PHOTO UPLOAD =====

/**
 * Initialize photo upload handler
 */
function initPhotoUpload() {
    const photoUpload = document.getElementById('photoUpload');
    if (!photoUpload) return;
    
    photoUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Preview the image
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('photoPreview').innerHTML = `<img src="${e.target.result}" alt="Photo Preview">`;
            };
            reader.readAsDataURL(file);

            // Upload the photo (in-memory, returns base64)
            const formData = new FormData();
            formData.append('photo', file);

            fetch('/upload_photo', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('photoFilename').value = data.photo_url;
                    showNotification('Photo uploaded successfully!', 'success');
                } else {
                    showNotification('Error uploading photo: ' + data.error, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Error uploading photo', 'error');
            });
        }
    });
}

// Export for module initialization
window.CVUpload = {
    initDragDropZone,
    initPhotoUpload,
    handleResumeUpload,
    autoFillFormFromResume
};
