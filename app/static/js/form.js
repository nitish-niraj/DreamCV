// DREAM CV Generator - Form Entry Management Module

/**
 * Planned Skills Configuration based on Cohort/Career Path
 * Skills that are recommended to learn for each career path
 */
const PLANNED_SKILLS_BY_COHORT = {
    'Full Stack Developer (Web/Mobile)': 'Kubernetes, GraphQL, Redis, Microservices Architecture, TypeScript, Next.js, Docker Swarm, AWS Lambda, MongoDB Atlas',
    'AIML (Artificial Intelligence & Machine Learning)': 'LangChain, Vector Databases, RAG Architecture, MLOps, Model Deployment, Transformers, AutoML, Reinforcement Learning, Edge AI',
    'Data Analyst': 'Apache Airflow, dbt, Advanced SQL, Machine Learning Basics, Cloud Data Platforms, Data Storytelling, Real-time Analytics',
    'Cyber Security': 'Cloud Security (AWS/Azure), Zero Trust Architecture, SOAR, Threat Intelligence, Container Security, DevSecOps, Incident Response',
    'Quality Assurance & Testing': 'AI-based Testing, Contract Testing, Chaos Engineering, Security Testing, Mobile Automation, API Mocking, Test Observability',
    'Game Development': 'Multiplayer Networking, VR/AR Development, Ray Tracing, Procedural Generation, Live Ops, Cross-platform Development'
};

/**
 * Skill Categories Configuration based on Cohort/Career Path
 * Each cohort has tailored skill categories with labels and placeholder examples
 */
const COHORT_SKILL_CATEGORIES = {
    'Full Stack Developer (Web/Mobile)': {
        cat1: { label: 'Programming Languages', placeholder: 'JavaScript, Python, Java, TypeScript, PHP' },
        cat2: { label: 'Frontend Technologies', placeholder: 'React.js, Angular, Vue.js, HTML5, CSS3, Bootstrap, Tailwind' },
        cat3: { label: 'Backend & Databases', placeholder: 'Node.js, Express, Django, Flask, MySQL, MongoDB, PostgreSQL' },
        cat4: { label: 'Mobile Development', placeholder: 'React Native, Flutter, Android, iOS, Swift, Kotlin' },
        cat5: { label: 'DevOps & Tools', placeholder: 'Git, Docker, AWS, Azure, CI/CD, Jenkins, Kubernetes' }
    },
    'AIML (Artificial Intelligence & Machine Learning)': {
        cat1: { label: 'Programming & ML Languages', placeholder: 'Python, R, Julia, SQL, MATLAB' },
        cat2: { label: 'ML/DL Frameworks', placeholder: 'TensorFlow, PyTorch, Keras, Scikit-learn, OpenCV, Hugging Face' },
        cat3: { label: 'Data Processing & Databases', placeholder: 'Pandas, NumPy, Spark, SQL, MongoDB, BigQuery' },
        cat4: { label: 'AI/ML Tools & Platforms', placeholder: 'Jupyter, Google Colab, AWS SageMaker, MLflow, Weights & Biases' },
        cat5: { label: 'Specialized Skills', placeholder: 'NLP, Computer Vision, Deep Learning, LLMs, Neural Networks, Prompt Engineering' }
    },
    'Data Analyst': {
        cat1: { label: 'Programming & Query Languages', placeholder: 'Python, SQL, R, Excel VBA' },
        cat2: { label: 'Visualization Tools', placeholder: 'Power BI, Tableau, Matplotlib, Seaborn, Plotly, Looker' },
        cat3: { label: 'Databases & Data Warehousing', placeholder: 'MySQL, PostgreSQL, Snowflake, Redshift, BigQuery' },
        cat4: { label: 'Data Processing', placeholder: 'Pandas, NumPy, Excel, Google Sheets, ETL Tools, Apache Spark' },
        cat5: { label: 'Statistical & Analytics Tools', placeholder: 'Statistical Analysis, A/B Testing, Regression, SPSS, SAS' }
    },
    'Cyber Security': {
        cat1: { label: 'Programming & Scripting', placeholder: 'Python, Bash, PowerShell, C, C++, Assembly' },
        cat2: { label: 'Security Tools', placeholder: 'Wireshark, Nmap, Metasploit, Burp Suite, OWASP ZAP, Nessus' },
        cat3: { label: 'Network & System Security', placeholder: 'Firewalls, IDS/IPS, VPN, Linux Security, Windows Security' },
        cat4: { label: 'Security Frameworks', placeholder: 'NIST, ISO 27001, OWASP, CIS Controls, SOC 2' },
        cat5: { label: 'Specialized Skills', placeholder: 'Penetration Testing, Ethical Hacking, Malware Analysis, SIEM, Cryptography' }
    },
    'Quality Assurance & Testing': {
        cat1: { label: 'Programming Languages', placeholder: 'Java, Python, JavaScript, C#, SQL' },
        cat2: { label: 'Testing Frameworks', placeholder: 'Selenium, Cypress, JUnit, TestNG, Pytest, Jest, Playwright' },
        cat3: { label: 'API & Performance Testing', placeholder: 'Postman, REST Assured, JMeter, LoadRunner, Gatling' },
        cat4: { label: 'CI/CD & DevOps', placeholder: 'Jenkins, Git, Docker, Azure DevOps, GitHub Actions' },
        cat5: { label: 'Testing Methodologies', placeholder: 'Agile Testing, BDD, TDD, Manual Testing, Regression, UAT, STLC' }
    },
    'Game Development': {
        cat1: { label: 'Programming Languages', placeholder: 'C++, C#, Python, Lua, JavaScript, GDScript' },
        cat2: { label: 'Game Engines', placeholder: 'Unity, Unreal Engine, Godot, CryEngine, RPG Maker' },
        cat3: { label: 'Graphics & Tools', placeholder: 'Blender, Maya, 3ds Max, Photoshop, Substance Painter' },
        cat4: { label: 'Game Development Skills', placeholder: 'Physics Engine, AI Behavior, Shaders, Networking, Animation' },
        cat5: { label: 'Platforms & Deployment', placeholder: 'Steam, PlayStation, Xbox, Nintendo, Android/iOS, WebGL' }
    },
    'default': {
        cat1: { label: 'Programming Languages', placeholder: 'Python, Java, C++, JavaScript' },
        cat2: { label: 'Web Technologies', placeholder: 'React, Node.js, HTML, CSS' },
        cat3: { label: 'Databases', placeholder: 'MySQL, MongoDB, PostgreSQL' },
        cat4: { label: 'Mobile Technologies', placeholder: 'React Native, Flutter' },
        cat5: { label: 'Other Tools & Technologies', placeholder: 'Git, Docker, AWS, Linux' }
    }
};

/**
 * Get skill categories for a specific cohort
 * @param {string} cohort - The selected cohort name
 * @returns {Object} The skill categories configuration
 */
function getSkillCategoriesForCohort(cohort) {
    return COHORT_SKILL_CATEGORIES[cohort] || COHORT_SKILL_CATEGORIES['default'];
}

/**
 * Update skill section labels and placeholders based on selected cohort
 * Called when user clicks "Align to DREAM" button
 */
function organizeSkillsForCohort() {
    const cohortSelect = document.querySelector('select[name="cohort"]');
    const cohort = cohortSelect ? cohortSelect.value : '';
    
    if (!cohort) {
        showToast('Please select a Target Cohort in the DREAM Company section first!', 'warning');
        // Scroll to cohort section
        document.getElementById('section2').scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    const categories = getSkillCategoriesForCohort(cohort);
    
    // Update labels
    document.getElementById('skill_cat1_label').textContent = categories.cat1.label;
    document.getElementById('skill_cat2_label').textContent = categories.cat2.label;
    document.getElementById('skill_cat3_label').textContent = categories.cat3.label;
    document.getElementById('skill_cat4_label').textContent = categories.cat4.label;
    document.getElementById('skill_cat5_label').textContent = categories.cat5.label;
    
    // Update placeholders
    document.getElementById('prog_languages').placeholder = categories.cat1.placeholder;
    document.getElementById('web_tech').placeholder = categories.cat2.placeholder;
    document.getElementById('databases').placeholder = categories.cat3.placeholder;
    document.getElementById('mobile_tech').placeholder = categories.cat4.placeholder;
    document.getElementById('other_tools').placeholder = categories.cat5.placeholder;
    
    // Update hint message
    const hintEl = document.getElementById('skillsHint');
    hintEl.className = 'alert alert-success py-2 mb-3';
    hintEl.innerHTML = `<small><i class="fas fa-check-circle"></i> <strong>Skills aligned for ${cohort}!</strong> Fill in your skills relevant to this career path.</small>`;
    
    showToast(`Skills section customized for ${cohort}!`, 'success');
}

/**
 * Check if all DREAM details are filled
 */
function areDreamDetailsFilled() {
    const cohort = document.querySelector('select[name="cohort"]')?.value;
    const dreamCompany = document.querySelector('input[name="dream_company"]')?.value;
    const targetRole = document.querySelector('input[name="target_role"]')?.value;
    
    return cohort && dreamCompany && targetRole;
}

/**
 * Try to auto-generate career objective if DREAM details are complete and summary is empty
 */
function tryAutoGenerateCareerObjective() {
    const summaryTextarea = document.getElementById('professional_summary');
    
    if (areDreamDetailsFilled() && (!summaryTextarea || summaryTextarea.value.trim() === '')) {
        // Check if there's at least some other data (skills or education)
        const hasSkills = document.querySelector('input[name="prog_languages"]')?.value ||
                         document.querySelector('input[name="web_tech"]')?.value;
        const hasEducation = document.querySelector('input[name="qual_degree[]"]')?.value;
        
        if (hasSkills || hasEducation) {
            setTimeout(() => {
                if (typeof generateCareerObjective === 'function') {
                    showToast('Auto-generating career objective based on your DREAM details...', 'info');
                    generateCareerObjective();
                }
            }, 500);
        }
    }
}

/**
 * Auto-update skills and planned skills when cohort changes
 */
function setupCohortChangeListener() {
    const cohortSelect = document.querySelector('select[name="cohort"]');
    if (cohortSelect) {
        cohortSelect.addEventListener('change', function() {
            if (this.value) {
                // Auto-align skills section
                organizeSkillsForCohort();
                
                // Auto-populate planned skills
                updatePlannedSkillsForCohort(this.value);
                
                // Try auto-generate career objective if all DREAM details are complete
                tryAutoGenerateCareerObjective();
            }
        });
    }
    
    // Also listen to other DREAM fields changes
    const dreamFields = ['dream_company', 'target_role', 'target_technology'];
    dreamFields.forEach(fieldName => {
        const field = document.querySelector(`input[name="${fieldName}"]`);
        if (field) {
            field.addEventListener('blur', function() {
                if (this.value.trim()) {
                    // If target_technology changes, update planned skills
                    if (fieldName === 'target_technology') {
                        updatePlannedSkillsForTechnology(this.value);
                    }
                    
                    // Try auto-generate career objective if all DREAM details are complete
                    tryAutoGenerateCareerObjective();
                }
            });
        }
    });
}

/**
 * Update planned skills based on selected cohort
 */
function updatePlannedSkillsForCohort(cohort) {
    const plannedSkillsInput = document.querySelector('input[name="planned_skills"]');
    if (!plannedSkillsInput) return;
    
    // Only update if empty or if user confirms
    if (plannedSkillsInput.value.trim() === '' || plannedSkillsInput.dataset.autoFilled === 'true') {
        const plannedSkills = PLANNED_SKILLS_BY_COHORT[cohort] || '';
        if (plannedSkills) {
            plannedSkillsInput.value = plannedSkills;
            plannedSkillsInput.dataset.autoFilled = 'true';
            showToast('Planned Skills updated based on your career path!', 'info');
        }
    }
}

/**
 * Update planned skills based on target technology
 */
function updatePlannedSkillsForTechnology(targetTech) {
    const plannedSkillsInput = document.querySelector('input[name="planned_skills"]');
    if (!plannedSkillsInput) return;
    
    // Technology-based skill recommendations
    const techSkillsMap = {
        'Full Stack': 'Kubernetes, GraphQL, Microservices, Redis, Next.js, TypeScript, Docker, CI/CD',
        'AI/ML': 'LangChain, Vector Databases, MLOps, Transformers, RAG, Model Deployment, AutoML',
        'Cloud': 'AWS Solutions Architect, Kubernetes, Terraform, Serverless, Multi-cloud, FinOps',
        'DevOps': 'ArgoCD, GitOps, Service Mesh, Observability, Platform Engineering, SRE Practices',
        'Data': 'Apache Spark, Kafka, dbt, Data Lakehouse, Real-time Analytics, Data Mesh',
        'Mobile': 'Flutter Advanced, SwiftUI, Kotlin Multiplatform, App Performance, AR/VR Mobile',
        'Blockchain': 'Smart Contracts, DeFi, Layer 2, Web3 Security, Cross-chain Development',
        'Cyber': 'Zero Trust, Cloud Security, SOAR, Threat Hunting, DevSecOps'
    };
    
    // Only update if empty
    if (plannedSkillsInput.value.trim() === '' || plannedSkillsInput.dataset.autoFilled === 'true') {
        const tech = targetTech.toLowerCase();
        for (const [key, skills] of Object.entries(techSkillsMap)) {
            if (tech.includes(key.toLowerCase())) {
                plannedSkillsInput.value = skills;
                plannedSkillsInput.dataset.autoFilled = 'true';
                return;
            }
        }
    }
}

/**
 * Show hint to update career objective when DREAM details change
 */
function showCareerObjectiveUpdateHint() {
    const summaryTextarea = document.getElementById('professional_summary');
    const generateBtn = document.getElementById('generateCareerObjective');
    
    if (summaryTextarea && generateBtn) {
        // Add a visual indicator that career objective should be updated
        generateBtn.classList.add('btn-warning');
        generateBtn.classList.remove('btn-outline-primary');
        generateBtn.innerHTML = '<i class="fas fa-magic"></i> Update with DREAM';
        
        // Reset after click
        generateBtn.addEventListener('click', function resetBtn() {
            setTimeout(() => {
                generateBtn.classList.remove('btn-warning');
                generateBtn.classList.add('btn-outline-primary');
                generateBtn.innerHTML = '<i class="fas fa-magic"></i> AI Generate';
            }, 1000);
            generateBtn.removeEventListener('click', resetBtn);
        }, { once: true });
    }
}

/**
 * Initialize DREAM Company alignment features
 * Call this after resume is parsed to auto-align everything
 */
function alignFormWithDreamDetails() {
    const cohortSelect = document.querySelector('select[name="cohort"]');
    const targetTech = document.querySelector('input[name="target_technology"]');
    const dreamCompany = document.querySelector('input[name="dream_company"]');
    const targetRole = document.querySelector('input[name="target_role"]');
    const summaryTextarea = document.getElementById('professional_summary');
    
    // Auto-align skills if cohort is selected
    if (cohortSelect && cohortSelect.value) {
        organizeSkillsForCohort();
        updatePlannedSkillsForCohort(cohortSelect.value);
    }
    
    // Update planned skills based on target technology
    if (targetTech && targetTech.value) {
        updatePlannedSkillsForTechnology(targetTech.value);
    }
    
    // Auto-generate career objective if DREAM details are filled and summary is empty
    if ((dreamCompany && dreamCompany.value) || (targetRole && targetRole.value)) {
        if (!summaryTextarea || summaryTextarea.value.trim() === '') {
            // Auto-trigger career objective generation after a short delay
            setTimeout(() => {
                if (typeof generateCareerObjective === 'function') {
                    showToast('Generating career objective aligned with your DREAM details...', 'info');
                    generateCareerObjective();
                }
            }, 1000);
        } else {
            // Show hint to update existing career objective
            showCareerObjectiveUpdateHint();
        }
    }
}

// Initialize cohort listener when DOM is ready
document.addEventListener('DOMContentLoaded', setupCohortChangeListener);

/**
 * Add a new qualification entry to the form
 */
function addQualification() {
    const container = document.getElementById('qualificationsList');
    const entry = document.createElement('div');
    entry.className = 'qualification-entry mb-3 p-3 border rounded';
    entry.innerHTML = `
        <button type="button" class="btn btn-sm btn-danger position-absolute" style="top: 5px; right: 5px;" onclick="removeEntry(this)">
            <i class="fas fa-times"></i>
        </button>
        <div class="row">
            <div class="col-md-4 mb-2">
                <label class="form-label">Degree/Level</label>
                <input type="text" class="form-control" name="qual_degree[]" placeholder="e.g., B.Tech, 12th, 10th">
            </div>
            <div class="col-md-4 mb-2">
                <label class="form-label">Institution</label>
                <input type="text" class="form-control" name="qual_institution[]">
            </div>
            <div class="col-md-4 mb-2">
                <label class="form-label">Board/University</label>
                <input type="text" class="form-control" name="qual_board[]">
            </div>
        </div>
        <div class="row">
            <div class="col-md-4 mb-2">
                <label class="form-label">Year of Passing</label>
                <input type="text" class="form-control" name="qual_year[]" placeholder="2024">
            </div>
            <div class="col-md-4 mb-2">
                <label class="form-label">Percentage/CGPA</label>
                <input type="text" class="form-control" name="qual_score[]" placeholder="8.5 CGPA / 85%">
            </div>
            <div class="col-md-4 mb-2">
                <label class="form-label">Duration</label>
                <input type="text" class="form-control" name="qual_duration[]" placeholder="2020 - 2024">
            </div>
        </div>
    `;
    container.appendChild(entry);
}

/**
 * Add a new internship entry to the form
 */
function addInternship() {
    const container = document.getElementById('internshipsList');
    const entry = document.createElement('div');
    entry.className = 'internship-entry mb-3 p-3 border rounded';
    entry.innerHTML = `
        <button type="button" class="btn btn-sm btn-danger position-absolute" style="top: 5px; right: 5px;" onclick="removeEntry(this)">
            <i class="fas fa-times"></i>
        </button>
        <div class="row">
            <div class="col-md-6 mb-2">
                <label class="form-label">Company Name</label>
                <input type="text" class="form-control" name="intern_company[]" placeholder="Google, Microsoft, etc.">
            </div>
            <div class="col-md-6 mb-2">
                <label class="form-label">Role/Position</label>
                <input type="text" class="form-control" name="intern_role[]" placeholder="Software Engineering Intern">
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 mb-2">
                <label class="form-label">Duration</label>
                <input type="text" class="form-control" name="intern_duration[]" placeholder="Jan 2024 - Mar 2024">
            </div>
            <div class="col-md-6 mb-2">
                <label class="form-label">Mode</label>
                <select class="form-select" name="intern_mode[]">
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                </select>
            </div>
        </div>
        <div class="mb-2">
            <label class="form-label">Key Points (3-4 bullet points)</label>
            <div class="bullet-inputs">
                <div class="input-group mb-1">
                    <span class="input-group-text">•</span>
                    <input type="text" class="form-control" name="intern_bullet1[]" placeholder="What you worked on / Main responsibility">
                </div>
                <div class="input-group mb-1">
                    <span class="input-group-text">•</span>
                    <input type="text" class="form-control" name="intern_bullet2[]" placeholder="Key achievement / Impact made">
                </div>
                <div class="input-group mb-1">
                    <span class="input-group-text">•</span>
                    <input type="text" class="form-control" name="intern_bullet3[]" placeholder="Technologies/Skills used">
                </div>
                <div class="input-group mb-1">
                    <span class="input-group-text">•</span>
                    <input type="text" class="form-control" name="intern_bullet4[]" placeholder="(Optional) Additional point">
                </div>
            </div>
        </div>
    `;
    container.appendChild(entry);
}

/**
 * Add a new certification entry to the form
 */
function addCertification() {
    const container = document.getElementById('certificationsList');
    const entry = document.createElement('div');
    entry.className = 'certification-entry mb-3 p-3 border rounded';
    entry.innerHTML = `
        <button type="button" class="btn btn-sm btn-danger position-absolute" style="top: 5px; right: 5px;" onclick="removeEntry(this)">
            <i class="fas fa-times"></i>
        </button>
        <div class="row">
            <div class="col-md-6 mb-2">
                <label class="form-label">Certification Title</label>
                <input type="text" class="form-control" name="cert_title[]" placeholder="AWS Certified Developer, ML Specialization">
            </div>
            <div class="col-md-6 mb-2">
                <label class="form-label">Issuing Organization</label>
                <input type="text" class="form-control" name="cert_source[]" placeholder="AWS, Coursera, Udemy, NPTEL">
            </div>
        </div>
        <div class="row">
            <div class="col-md-4 mb-2">
                <label class="form-label">Issue Date</label>
                <input type="text" class="form-control" name="cert_date[]" placeholder="Mar 2024">
            </div>
            <div class="col-md-4 mb-2">
                <label class="form-label">Credential ID</label>
                <input type="text" class="form-control" name="cert_id[]" placeholder="ABC123XYZ">
            </div>
            <div class="col-md-4 mb-2">
                <label class="form-label">Type</label>
                <select class="form-select" name="cert_type[]">
                    <option value="Certification">Certification</option>
                    <option value="MOOC">MOOC</option>
                    <option value="Training">Training</option>
                    <option value="Workshop">Workshop</option>
                </select>
            </div>
        </div>
    `;
    container.appendChild(entry);
}

/**
 * Add a new project entry to the form
 */
function addProject() {
    const container = document.getElementById('projectsList');
    const entry = document.createElement('div');
    entry.className = 'project-entry mb-3 p-3 border rounded';
    entry.innerHTML = `
        <button type="button" class="btn btn-sm btn-danger position-absolute" style="top: 5px; right: 5px;" onclick="removeEntry(this)">
            <i class="fas fa-times"></i>
        </button>
        <div class="row">
            <div class="col-md-6 mb-2">
                <label class="form-label">Project Name</label>
                <input type="text" class="form-control" name="proj_name[]">
            </div>
            <div class="col-md-6 mb-2">
                <label class="form-label">Your Role</label>
                <input type="text" class="form-control" name="proj_role[]" placeholder="Team Lead, Developer">
            </div>
        </div>
        <div class="mb-2">
            <label class="form-label">Project Highlights (3-4 bullet points)</label>
            <div class="bullet-inputs">
                <div class="input-group mb-1">
                    <span class="input-group-text">•</span>
                    <input type="text" class="form-control" name="proj_bullet1[]" placeholder="What the project does / Problem it solves">
                </div>
                <div class="input-group mb-1">
                    <span class="input-group-text">•</span>
                    <input type="text" class="form-control" name="proj_bullet2[]" placeholder="Your contribution / Key feature you built">
                </div>
                <div class="input-group mb-1">
                    <span class="input-group-text">•</span>
                    <input type="text" class="form-control" name="proj_bullet3[]" placeholder="Impact / Users / Results achieved">
                </div>
                <div class="input-group mb-1">
                    <span class="input-group-text">•</span>
                    <input type="text" class="form-control" name="proj_bullet4[]" placeholder="(Optional) Additional highlight">
                </div>
            </div>
        </div>
        <div class="mb-2">
            <label class="form-label">Technologies Used</label>
            <input type="text" class="form-control" name="proj_tech[]" placeholder="React, Node.js, MongoDB">
        </div>
    `;
    container.appendChild(entry);
}

/**
 * Add a new responsibility entry to the form
 */
function addResponsibility() {
    const container = document.getElementById('responsibilitiesList');
    const entry = document.createElement('div');
    entry.className = 'responsibility-entry mb-3 p-3 border rounded';
    entry.innerHTML = `
        <button type="button" class="btn btn-sm btn-danger position-absolute" style="top: 5px; right: 5px;" onclick="removeEntry(this)">
            <i class="fas fa-times"></i>
        </button>
        <div class="row">
            <div class="col-md-4 mb-2">
                <label class="form-label">Role/Position</label>
                <input type="text" class="form-control" name="resp_role[]" placeholder="Technical Lead, Club President">
            </div>
            <div class="col-md-4 mb-2">
                <label class="form-label">Organization</label>
                <input type="text" class="form-control" name="resp_org[]" placeholder="Coding Club, IEEE Student Branch">
            </div>
            <div class="col-md-4 mb-2">
                <label class="form-label">Duration</label>
                <input type="text" class="form-control" name="resp_duration[]" placeholder="Aug 2023 - Present">
            </div>
        </div>
        <div class="mb-2">
            <label class="form-label">Key Contributions (2-3 bullet points)</label>
            <div class="bullet-inputs">
                <div class="input-group mb-1">
                    <span class="input-group-text">•</span>
                    <input type="text" class="form-control" name="resp_bullet1[]" placeholder="Main responsibility / What you led">
                </div>
                <div class="input-group mb-1">
                    <span class="input-group-text">•</span>
                    <input type="text" class="form-control" name="resp_bullet2[]" placeholder="Achievement / Impact made">
                </div>
                <div class="input-group mb-1">
                    <span class="input-group-text">•</span>
                    <input type="text" class="form-control" name="resp_bullet3[]" placeholder="(Optional) Additional contribution">
                </div>
            </div>
        </div>
    `;
    container.appendChild(entry);
}

/**
 * Add a new work experience entry to the form
 */
function addExperience() {
    const container = document.getElementById('experiencesList');
    const entry = document.createElement('div');
    entry.className = 'experience-entry mb-3 p-3 border rounded';
    entry.innerHTML = `
        <button type="button" class="btn btn-sm btn-danger position-absolute" style="top: 5px; right: 5px;" onclick="removeEntry(this)">
            <i class="fas fa-times"></i>
        </button>
        <div class="row">
            <div class="col-md-6 mb-2">
                <label class="form-label">Company</label>
                <input type="text" class="form-control" name="exp_company[]">
            </div>
            <div class="col-md-6 mb-2">
                <label class="form-label">Role</label>
                <input type="text" class="form-control" name="exp_role[]">
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 mb-2">
                <label class="form-label">Duration</label>
                <input type="text" class="form-control" name="exp_duration[]" placeholder="Jun 2023 - Dec 2023">
            </div>
            <div class="col-md-6 mb-2">
                <label class="form-label">Salary Package</label>
                <input type="text" class="form-control" name="exp_salary[]" placeholder="5 LPA">
            </div>
        </div>
        <div class="mb-2">
            <label class="form-label">Key Responsibilities (3-4 bullet points)</label>
            <div class="bullet-inputs">
                <div class="input-group mb-1">
                    <span class="input-group-text">•</span>
                    <input type="text" class="form-control" name="exp_bullet1[]" placeholder="Main role / Daily responsibilities">
                </div>
                <div class="input-group mb-1">
                    <span class="input-group-text">•</span>
                    <input type="text" class="form-control" name="exp_bullet2[]" placeholder="Key project / Achievement">
                </div>
                <div class="input-group mb-1">
                    <span class="input-group-text">•</span>
                    <input type="text" class="form-control" name="exp_bullet3[]" placeholder="Impact / Results delivered">
                </div>
                <div class="input-group mb-1">
                    <span class="input-group-text">•</span>
                    <input type="text" class="form-control" name="exp_bullet4[]" placeholder="(Optional) Additional responsibility">
                </div>
            </div>
        </div>
    `;
    container.appendChild(entry);
}

/**
 * Add a new language entry to the form
 */
function addLanguage() {
    const container = document.getElementById('languagesList');
    const entry = document.createElement('div');
    entry.className = 'language-entry mb-2 row';
    entry.innerHTML = `
        <div class="col-md-4">
            <input type="text" class="form-control" name="lang_name[]" placeholder="Language">
        </div>
        <div class="col-md-7">
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" name="lang_speak[]" value="1">
                <label class="form-check-label">Speak</label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" name="lang_write[]" value="1">
                <label class="form-check-label">Write</label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" name="lang_read[]" value="1">
                <label class="form-check-label">Read</label>
            </div>
        </div>
        <div class="col-md-1">
            <button type="button" class="btn btn-sm btn-danger" onclick="removeEntry(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    container.appendChild(entry);
}

/**
 * Add a new community activity bullet point
 */
function addCommunityActivity() {
    const container = document.getElementById('communityActivitiesList');
    const entry = document.createElement('div');
    entry.className = 'input-group mb-1';
    entry.innerHTML = `
        <span class="input-group-text">•</span>
        <input type="text" class="form-control" name="community_activity[]" placeholder="Another community activity">
        <button type="button" class="btn btn-outline-danger btn-sm" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(entry);
}

/**
 * Add a new achievement bullet point
 */
function addAchievement() {
    const container = document.getElementById('achievementsList');
    const entry = document.createElement('div');
    entry.className = 'input-group mb-1';
    entry.innerHTML = `
        <span class="input-group-text">•</span>
        <input type="text" class="form-control" name="achievement[]" placeholder="Another achievement">
        <button type="button" class="btn btn-outline-danger btn-sm" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(entry);
}

/**
 * Add a new technical event bullet point
 */
function addTechEvent() {
    const container = document.getElementById('techEventsList');
    const entry = document.createElement('div');
    entry.className = 'input-group mb-1';
    entry.innerHTML = `
        <span class="input-group-text">•</span>
        <input type="text" class="form-control" name="tech_event[]" placeholder="Another technical event">
        <button type="button" class="btn btn-outline-danger btn-sm" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(entry);
}

/**
 * Add a new other platform entry
 */
function addOtherPlatform() {
    const container = document.getElementById('otherPlatformsList');
    const entry = document.createElement('div');
    entry.className = 'other-platform-entry row mb-2';
    entry.innerHTML = `
        <div class="col-md-4">
            <input type="text" class="form-control" name="other_platform_name[]" placeholder="Platform Name">
        </div>
        <div class="col-md-7">
            <input type="url" class="form-control" name="other_platform_url[]" placeholder="https://platform-url.com/username">
        </div>
        <div class="col-md-1">
            <button type="button" class="btn btn-outline-danger btn-sm" onclick="removeOtherPlatform(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    container.appendChild(entry);
}

/**
 * Remove an other platform entry
 */
function removeOtherPlatform(button) {
    button.closest('.other-platform-entry').remove();
}

/**
 * Remove an entry from the form
 * @param {HTMLElement} button - The remove button that was clicked
 */
function removeEntry(button) {
    button.closest('.qualification-entry, .certification-entry, .project-entry, .responsibility-entry, .experience-entry, .language-entry, .internship-entry').remove();
    updateProgress();
    updateLivePreview();
}

/**
 * Collect all form data into a structured object
 * @returns {Object} The collected form data
 */
function collectFormData() {
    const form = document.getElementById('cvForm');
    const formData = new FormData(form);
    
    // Basic fields
    const data = {
        full_name: formData.get('full_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        linkedin: formData.get('linkedin'),
        github: formData.get('github'),
        portfolio: formData.get('portfolio'),
        skype: formData.get('skype'),
        address: formData.get('address'),
        photo_url: formData.get('photo_filename'),
        professional_summary: formData.get('professional_summary'),
        
        // Dream Company
        cohort: formData.get('cohort'),
        dream_company: formData.get('dream_company'),
        target_role: formData.get('target_role'),
        target_technology: formData.get('target_technology'),
        expected_package: formData.get('expected_package'),
        
        // Technical Skills
        prog_languages: formData.get('prog_languages'),
        web_tech: formData.get('web_tech'),
        databases: formData.get('databases'),
        mobile_tech: formData.get('mobile_tech'),
        other_tools: formData.get('other_tools'),
        planned_skills: formData.get('planned_skills'),
        
        // Extra Curricular (now as arrays for bullet points)
        community_activities: formData.getAll('community_activity[]').filter(a => a.trim()),
        achievements: formData.getAll('achievement[]').filter(a => a.trim()),
        
        // Digital Existence - All Coding Platforms
        leetcode: formData.get('leetcode'),
        gfg: formData.get('gfg'),
        interviewbit: formData.get('interviewbit'),
        codeforces: formData.get('codeforces'),
        codechef: formData.get('codechef'),
        atcoder: formData.get('atcoder'),
        hackerrank: formData.get('hackerrank'),
        hackerearth: formData.get('hackerearth'),
        codility: formData.get('codility'),
        codesignal: formData.get('codesignal'),
        kaggle: formData.get('kaggle'),
        huggingface: formData.get('huggingface'),
        
        // Technical Events (as array for bullet points)
        tech_events: formData.getAll('tech_event[]').filter(e => e.trim()),
        community_associations: formData.get('community_associations'),
        
        // Other Platforms (custom entries)
        other_platforms: [],
        
        // Planned Certifications
        planned_certifications: formData.get('planned_certifications'),
        
        // Arrays
        qualifications: [],
        internships: [],
        certifications: [],
        projects: [],
        responsibilities: [],
        experiences: [],
        languages: []
    };
    
    // Collect qualifications
    const qualDegrees = formData.getAll('qual_degree[]');
    const qualInstitutions = formData.getAll('qual_institution[]');
    const qualBoards = formData.getAll('qual_board[]');
    const qualYears = formData.getAll('qual_year[]');
    const qualScores = formData.getAll('qual_score[]');
    const qualDurations = formData.getAll('qual_duration[]');
    
    for (let i = 0; i < qualDegrees.length; i++) {
        if (qualDegrees[i]) {
            data.qualifications.push({
                degree: qualDegrees[i],
                institution: qualInstitutions[i] || '',
                board: qualBoards[i] || '',
                year: qualYears[i] || '',
                score: qualScores[i] || '',
                duration: qualDurations[i] || ''
            });
        }
    }
    
    // Collect internships (with bullet points)
    const internCompanies = formData.getAll('intern_company[]');
    const internRoles = formData.getAll('intern_role[]');
    const internDurations = formData.getAll('intern_duration[]');
    const internModes = formData.getAll('intern_mode[]');
    const internBullet1 = formData.getAll('intern_bullet1[]');
    const internBullet2 = formData.getAll('intern_bullet2[]');
    const internBullet3 = formData.getAll('intern_bullet3[]');
    const internBullet4 = formData.getAll('intern_bullet4[]');
    
    for (let i = 0; i < internCompanies.length; i++) {
        if (internCompanies[i]) {
            const bullets = [
                internBullet1[i] || '',
                internBullet2[i] || '',
                internBullet3[i] || '',
                internBullet4[i] || ''
            ].filter(b => b.trim());
            
            data.internships.push({
                company: internCompanies[i],
                role: internRoles[i] || '',
                duration: internDurations[i] || '',
                mode: internModes[i] || 'On-site',
                bullets: bullets
            });
        }
    }
    
    // Collect certifications
    const certTitles = formData.getAll('cert_title[]');
    const certSources = formData.getAll('cert_source[]');
    const certDates = formData.getAll('cert_date[]');
    const certIds = formData.getAll('cert_id[]');
    const certTypes = formData.getAll('cert_type[]');
    
    for (let i = 0; i < certTitles.length; i++) {
        if (certTitles[i]) {
            data.certifications.push({
                title: certTitles[i],
                source: certSources[i] || '',
                date: certDates[i] || '',
                credential_id: certIds[i] || '',
                type: certTypes[i] || 'Certification'
            });
        }
    }
    
    // Collect projects (with bullet points)
    const projNames = formData.getAll('proj_name[]');
    const projRoles = formData.getAll('proj_role[]');
    const projBullet1 = formData.getAll('proj_bullet1[]');
    const projBullet2 = formData.getAll('proj_bullet2[]');
    const projBullet3 = formData.getAll('proj_bullet3[]');
    const projBullet4 = formData.getAll('proj_bullet4[]');
    const projTechs = formData.getAll('proj_tech[]');
    
    for (let i = 0; i < projNames.length; i++) {
        if (projNames[i]) {
            const bullets = [
                projBullet1[i] || '',
                projBullet2[i] || '',
                projBullet3[i] || '',
                projBullet4[i] || ''
            ].filter(b => b.trim());
            
            data.projects.push({
                name: projNames[i],
                role: projRoles[i] || '',
                bullets: bullets,
                tech: projTechs[i] || ''
            });
        }
    }
    
    // Collect responsibilities (with bullet points and organization)
    const respRoles = formData.getAll('resp_role[]');
    const respOrgs = formData.getAll('resp_org[]');
    const respDurations = formData.getAll('resp_duration[]');
    const respBullet1 = formData.getAll('resp_bullet1[]');
    const respBullet2 = formData.getAll('resp_bullet2[]');
    const respBullet3 = formData.getAll('resp_bullet3[]');
    
    for (let i = 0; i < respRoles.length; i++) {
        if (respRoles[i]) {
            const bullets = [
                respBullet1[i] || '',
                respBullet2[i] || '',
                respBullet3[i] || ''
            ].filter(b => b.trim());
            
            data.responsibilities.push({
                role: respRoles[i],
                organization: respOrgs[i] || '',
                duration: respDurations[i] || '',
                bullets: bullets
            });
        }
    }
    
    // Collect experiences (with bullet points)
    const expCompanies = formData.getAll('exp_company[]');
    const expRoles = formData.getAll('exp_role[]');
    const expDurations = formData.getAll('exp_duration[]');
    const expSalaries = formData.getAll('exp_salary[]');
    const expBullet1 = formData.getAll('exp_bullet1[]');
    const expBullet2 = formData.getAll('exp_bullet2[]');
    const expBullet3 = formData.getAll('exp_bullet3[]');
    const expBullet4 = formData.getAll('exp_bullet4[]');
    
    for (let i = 0; i < expCompanies.length; i++) {
        if (expCompanies[i]) {
            const bullets = [
                expBullet1[i] || '',
                expBullet2[i] || '',
                expBullet3[i] || '',
                expBullet4[i] || ''
            ].filter(b => b.trim());
            
            data.experiences.push({
                company: expCompanies[i],
                role: expRoles[i] || '',
                duration: expDurations[i] || '',
                salary: expSalaries[i] || '',
                bullets: bullets
            });
        }
    }
    
    // Collect languages
    const langNames = formData.getAll('lang_name[]');
    const langEntries = document.querySelectorAll('.language-entry');
    
    langEntries.forEach((entry, i) => {
        const name = langNames[i];
        if (name) {
            const abilities = [];
            if (entry.querySelector('input[name="lang_speak[]"]:checked')) abilities.push('Speak');
            if (entry.querySelector('input[name="lang_write[]"]:checked')) abilities.push('Write');
            if (entry.querySelector('input[name="lang_read[]"]:checked')) abilities.push('Read');
            
            data.languages.push({
                name: name,
                abilities: abilities.join(', ')
            });
        }
    });
    
    // Collect other platforms (custom entries)
    const otherPlatformNames = formData.getAll('other_platform_name[]');
    const otherPlatformUrls = formData.getAll('other_platform_url[]');
    
    for (let i = 0; i < otherPlatformNames.length; i++) {
        if (otherPlatformNames[i] && otherPlatformUrls[i]) {
            data.other_platforms.push({
                name: otherPlatformNames[i].trim(),
                url: otherPlatformUrls[i].trim()
            });
        }
    }
    
    return data;
}

// Export functions for global access
window.CVForm = {
    addQualification,
    addInternship,
    addCertification,
    addProject,
    addResponsibility,
    addExperience,
    addLanguage,
    addCommunityActivity,
    addAchievement,
    addTechEvent,
    addOtherPlatform,
    removeOtherPlatform,
    removeEntry,
    collectFormData,
    organizeSkillsForCohort,
    getSkillCategoriesForCohort,
    alignFormWithDreamDetails,
    updatePlannedSkillsForCohort,
    updatePlannedSkillsForTechnology,
    showCareerObjectiveUpdateHint,
    areDreamDetailsFilled,
    tryAutoGenerateCareerObjective,
    COHORT_SKILL_CATEGORIES,
    PLANNED_SKILLS_BY_COHORT
};

// Expose functions globally for onclick handlers
window.organizeSkillsForCohort = organizeSkillsForCohort;
window.alignFormWithDreamDetails = alignFormWithDreamDetails;
window.updatePlannedSkillsForCohort = updatePlannedSkillsForCohort;
window.tryAutoGenerateCareerObjective = tryAutoGenerateCareerObjective;
window.addCommunityActivity = addCommunityActivity;
window.addAchievement = addAchievement;
window.addTechEvent = addTechEvent;
window.addOtherPlatform = addOtherPlatform;
window.removeOtherPlatform = removeOtherPlatform;
