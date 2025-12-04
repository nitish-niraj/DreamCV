"""
LLM Prompts - All prompt templates for AI interactions
Optimized for ATS-friendly, professional resume generation
"""

# Resume parsing prompt - standard version
RESUME_PARSE_PROMPT = """You are an expert resume parser and career advisor. Extract ALL information from this resume text and format it professionally.

RESUME TEXT TO PARSE:
\"\"\"
{text_sample}
\"\"\"

EXTRACTION AND FORMATTING RULES:

1. DATES/DURATIONS - Use consistent format:
   - For ongoing roles: "Month Year - Present" (e.g., "January 2024 - Present")
   - For completed roles: "Month Year - Month Year" (e.g., "June 2023 - December 2023")
   - For education: "Year - Year" (e.g., "2020 - 2024")
   - NEVER use brackets around dates like [Jan 2024]

2. EDUCATION/QUALIFICATIONS: 
   - Look for B.Tech, B.E., M.Tech, MBA, MCA, BCA, 12th, 10th, HSC, SSC, CBSE, ICSE, Diploma
   - Order: Highest degree first (B.Tech before 12th before 10th)
   - Include university/board, CGPA/percentage

3. WORK EXPERIENCE (for experienced candidates):
   - Extract actual job titles and real company names
   - Format: "Role at Company" with duration
   - Create achievement-focused bullet points starting with action verbs
   - Quantify achievements where possible (%, numbers, impact)
   - Return bullets as ARRAY of 3-4 short strings

4. INTERNSHIPS:
   - Only include real internships with verifiable company names
   - Format duration consistently
   - Extract meaningful responsibilities as ARRAY of 3-4 bullet points
   - Determine mode: Remote, On-site, or Hybrid

5. CERTIFICATIONS:
   - Include issuing organization and date
   - Extract credential ID if available
   - Prioritize industry-recognized certifications
   - Type: Certification, MOOC, Training, or Workshop

6. PROJECTS:
   - Extract project names, technologies, and outcomes
   - Focus on impact and technical complexity
   - Include GitHub/live links if mentioned
   - Return project description as ARRAY of 3-4 bullet points

7. SKILLS - Categorize logically:
   - Programming Languages: Python, Java, C++, JavaScript, etc.
   - Web Technologies: React, Node.js, Django, Flask, etc.
   - Databases: MySQL, MongoDB, PostgreSQL, etc.
   - Mobile Technologies: Android, Flutter, React Native, etc.
   - Tools/Platforms: Git, Docker, AWS, Linux, etc.

8. BULLET POINTS FORMAT:
   - MUST be returned as ARRAY of strings, NOT a single paragraph
   - Start with strong action verbs (Developed, Led, Implemented, Designed, etc.)
   - Keep concise: 1 line maximum per bullet
   - Focus on achievements and impact, not just duties
   - Maximum 4 bullets per entry

9. PROFESSIONAL SUMMARY (if extractable):
   - Create a 2-3 sentence summary based on experience level
   - Highlight key skills and career focus

10. RESPONSIBILITIES (Leadership/Volunteer Roles):
    - Extract any club positions, volunteer roles, leadership positions
    - Include organization name and duration
    - Return description as ARRAY of 2-3 bullet points

11. DIGITAL PROFILES - Extract ALL coding/professional platform links:
    - LeetCode, GeeksforGeeks, Codeforces, CodeChef, AtCoder
    - HackerRank, HackerEarth, Codility, CodeSignal
    - Kaggle, HuggingFace, InterviewBit
    - Also extract any rankings/ratings mentioned

12. EXTRA CURRICULAR:
    - Community activities as ARRAY (volunteer work, clubs, social service)
    - Achievements as ARRAY (awards, competitions, hackathons)
    - Technical events participated as ARRAY

13. LANGUAGES:
    - Extract spoken languages with proficiency (Speak/Write/Read)

Return a valid JSON object with these exact fields:
{{
    "full_name": "Full Name (properly capitalized)",
    "email": "email@example.com",
    "phone": "+91 9876543210",
    "address": "City, State",
    "linkedin": "Full LinkedIn URL (https://linkedin.com/in/username)",
    "github": "Full GitHub URL (https://github.com/username)",
    "portfolio": "Portfolio website URL",
    "professional_summary": "2-3 sentence professional summary highlighting key strengths and career objectives",
    
    "prog_languages": "Python, Java, C++, JavaScript",
    "web_tech": "React, Node.js, HTML, CSS, Django, Flask",
    "databases": "MySQL, MongoDB, PostgreSQL",
    "mobile_tech": "Android, Flutter, AWS, Azure",
    "other_tools": "Git, Docker, Linux, VS Code, Jira",
    
    "qualifications": [
        {{"degree": "Bachelor of Technology in Computer Science", "institution": "ABC College of Engineering", "board": "XYZ University", "year": "2024", "score": "8.5 CGPA", "duration": "2020 - 2024"}},
        {{"degree": "Higher Secondary (12th)", "institution": "School Name", "board": "CBSE", "year": "2020", "score": "85%", "duration": "2018 - 2020"}},
        {{"degree": "Secondary (10th)", "institution": "School Name", "board": "CBSE", "year": "2018", "score": "90%", "duration": ""}}
    ],
    
    "experiences": [
        {{"company": "Real Company Name", "role": "Software Developer", "duration": "June 2023 - Present", "bullets": ["Developed REST APIs serving 10,000+ daily requests using Python and Flask", "Reduced page load time by 40% through code optimization", "Collaborated with cross-functional team of 8 engineers"]}}
    ],
    
    "internships": [
        {{"company": "Real Company Name", "role": "Software Engineering Intern", "duration": "January 2024 - March 2024", "mode": "Remote", "bullets": ["Built automated testing framework reducing QA time by 30%", "Contributed to frontend development using React.js", "Participated in agile sprint planning and code reviews"]}}
    ],
    
    "certifications": [
        {{"title": "AWS Certified Cloud Practitioner", "source": "Amazon Web Services", "date": "March 2024", "credential_id": "ABC123XYZ", "url": "https://verify.aws/credential", "type": "Certification"}}
    ],
    
    "projects": [
        {{"name": "E-Commerce Platform", "role": "Full Stack Developer", "duration": "August 2023 - October 2023", "link": "https://github.com/user/project", "bullets": ["Developed full-stack web application handling 500+ concurrent users", "Implemented secure payment gateway with Stripe integration", "Deployed on AWS EC2 with 99.9% uptime"], "tech": "React.js, Node.js, MongoDB, AWS"}}
    ],
    
    "responsibilities": [
        {{"role": "Technical Lead", "organization": "College Tech Club", "duration": "August 2023 - Present", "bullets": ["Led team of 15 students in organizing coding workshops", "Mentored 50+ junior students in programming fundamentals"]}}
    ],
    
    "languages": [
        {{"name": "English", "abilities": "Professional proficiency"}},
        {{"name": "Hindi", "abilities": "Native speaker"}}
    ],
    
    "leetcode": "https://leetcode.com/username",
    "leetcode_stats": "300+ problems solved, Top 10% globally",
    "gfg": "https://geeksforgeeks.org/user/username",
    "gfg_stats": "Institute Rank 5, 500+ problems",
    "interviewbit": "https://interviewbit.com/profile/username",
    "codeforces": "https://codeforces.com/profile/username",
    "codeforces_rating": "Expert (1600+)",
    "codechef": "https://codechef.com/users/username",
    "codechef_rating": "4 Star (1800+)",
    "atcoder": "https://atcoder.jp/users/username",
    "hackerrank": "https://hackerrank.com/username",
    "hackerrank_badges": "5 Star Python, 4 Star Problem Solving",
    "hackerearth": "https://hackerearth.com/@username",
    "codility": "https://codility.com/profile/username",
    "codesignal": "https://codesignal.com/profile/username",
    "kaggle": "https://kaggle.com/username",
    "kaggle_rank": "Expert, 2 Bronze medals",
    "huggingface": "https://huggingface.co/username",
    
    "tech_events": ["Smart India Hackathon 2024 Finalist", "Google Code Jam 2023 Participant", "CodeChef SnackDown Qualifier"],
    "community_activities": ["NSS Volunteer - 100+ service hours", "Tech Club Core Member", "Organized annual tech fest with 500+ participants"],
    "achievements_list": ["First place in University Hackathon 2024", "Published research paper in IEEE conference", "Dean's List for Academic Excellence"],
    "community_associations": "IEEE Student Member, ACM Student Chapter, Google Developer Student Club"
}}

CRITICAL INSTRUCTIONS:
- Extract EVERYTHING found - don't skip any section
- Use proper capitalization (Title Case for names, roles, organizations)
- Format durations consistently: "Month Year - Month Year" or "Month Year - Present"
- NEVER include fake/placeholder data - use empty string "" if not found
- Use empty array [] if a section has no entries
- Make bullet points achievement-focused with quantifiable results
- Return ONLY valid JSON, no markdown, no explanations
- Ensure URLs are complete (with https://)"""


# Resume parsing prompt with DREAM context - tailored extraction
RESUME_PARSE_PROMPT_WITH_CONTEXT = """You are an expert resume parser and career advisor. Extract ALL information from this resume text and format it professionally.

IMPORTANT: The candidate is targeting a specific DREAM company/role. Tailor the extraction to highlight relevant skills and experiences.

=== DREAM COMPANY CONTEXT ===
- Target Cohort/Domain: {cohort}
- Dream Company: {dream_company}
- Target Role: {target_role}
- Target Technology: {target_technology}

RESUME TEXT TO PARSE:
\"\"\"
{text_sample}
\"\"\"

EXTRACTION AND FORMATTING RULES:

1. PRIORITIZE skills and experiences relevant to the TARGET ROLE ({target_role}) and TARGET TECHNOLOGY ({target_technology})

2. DATES/DURATIONS - Use consistent format:
   - For ongoing roles: "Month Year - Present"
   - For completed roles: "Month Year - Month Year"
   - For education: "Year - Year"

3. EDUCATION/QUALIFICATIONS: 
   - Order: Highest degree first
   - Include university/board, CGPA/percentage

4. WORK EXPERIENCE & INTERNSHIPS:
   - Highlight experiences relevant to {target_role}
   - Create achievement-focused bullet points
   - Emphasize achievements in {target_technology}
   - Return bullets as ARRAY of 3-4 short strings

5. CERTIFICATIONS & PROJECTS:
   - Prioritize those relevant to {target_technology} and {target_role}
   - Include links and technologies used

6. SKILLS - Categorize with PRIORITY to target role:
   - Put {target_technology}-related skills first

7. BULLET POINTS FORMAT:
   - MUST be returned as ARRAY of strings
   - Start with strong action verbs
   - Highlight achievements related to {target_role}

Return a valid JSON object matching the standard schema with fields: full_name, email, phone, address, linkedin, github, portfolio, professional_summary, prog_languages, web_tech, databases, mobile_tech, other_tools, qualifications, experiences, internships, certifications, projects, responsibilities, languages, and all coding profile fields.

CRITICAL: PRIORITIZE extraction of skills/experiences relevant to {dream_company} and {target_role}. NEVER include fake data - use empty string or empty array if not found. Return ONLY valid JSON."""


# Planned Skills Generation Prompt - generates skills to learn based on DREAM target
PLANNED_SKILLS_PROMPT = """You are a career advisor specializing in technology career paths. Based on the candidate's DREAM company target and current skills, suggest skills and certifications they should plan to acquire.

=== DREAM COMPANY CONTEXT ===
- Target Cohort/Domain: {cohort}
- Dream Company: {dream_company}
- Target Role: {target_role}
- Target Technology Focus: {target_technology}

=== CANDIDATE'S CURRENT SKILLS ===
- Programming Languages: {current_languages}
- Web Technologies: {current_web_tech}
- Databases: {current_databases}
- Mobile/Cloud: {current_mobile_tech}
- Tools: {current_tools}

=== TASK ===
Generate a strategic list of skills and certifications the candidate should PLAN to learn to achieve their goal of becoming a {target_role} at {dream_company}.

CONSIDER:
1. What skills are commonly required for {target_role} at companies like {dream_company}?
2. What certifications are valued in the {cohort} domain?
3. What skills gaps exist between current skills and target role requirements?
4. What emerging technologies should they learn?

Return a JSON object with:
{{
    "planned_skills": {{
        "programming_languages": ["Language 1 to learn", "Language 2 to learn"],
        "frameworks_libraries": ["Framework 1", "Framework 2"],
        "cloud_devops": ["AWS/Azure/GCP skills", "Docker/Kubernetes"],
        "databases": ["Database to learn"],
        "soft_skills": ["Communication", "Leadership"],
        "domain_specific": ["Skills specific to {cohort}"]
    }},
    "planned_certifications": [
        {{"title": "Certification Name", "provider": "Provider", "priority": "High/Medium/Low", "reason": "Why valuable for {target_role}"}}
    ],
    "learning_path": "A brief 2-3 sentence suggested learning path to reach their goal"
}}

GUIDELINES:
- Suggest 2-4 items per skill category (not too many)
- Prioritize certifications that {dream_company} typically values
- Be specific to the {cohort} domain
- Make recommendations achievable within 6-12 months

Return ONLY valid JSON, no other text."""


# Natural language formatting prompts
NATURAL_LANGUAGE_PROMPTS = {
    'project': """Convert this project description into ATS-optimized resume format.

User Description: {}

Return a JSON object with:
{{
    "name": "Project Name (Clear, Professional Title)",
    "role": "Your Role (e.g., Lead Developer, Full Stack Developer)",
    "duration": "Month Year - Month Year",
    "link": "GitHub or live project URL if mentioned",
    "bullets": ["Achievement-focused point starting with action verb", "Quantified impact point", "Technical implementation point"],
    "tech": "React.js, Node.js, MongoDB (comma-separated technologies)"
}}

GUIDELINES:
- Start each bullet with strong action verbs: Developed, Implemented, Designed, Built, Created, Optimized
- Quantify achievements where possible (%, numbers, users, performance improvements)
- Keep bullets concise (1-2 lines each)
- Maximum 4 bullet points per project
Return ONLY valid JSON, no other text.""",
    
    'experience': """Convert this work experience into ATS-optimized resume format.

User Description: {}

Return a JSON object with:
{{
    "company": "Company Name",
    "role": "Professional Job Title",
    "duration": "Month Year - Month Year (or Present)",
    "bullets": ["Achievement with quantified result", "Technical contribution", "Leadership or collaboration point"]
}}

GUIDELINES:
- Use strong action verbs: Led, Developed, Managed, Implemented, Increased, Reduced
- Include metrics: % improvements, team sizes, revenue impact, user counts
- Focus on achievements, not job duties
- Keep bullets concise and impactful
Return ONLY valid JSON, no other text.""",

    'certification': """Convert this certification/course into professional resume format.

User Description: {}

Return a JSON object with:
{{
    "title": "Certification/Course Name (Full Official Title)",
    "source": "Issuing Organization (e.g., AWS, Google, Coursera)",
    "date": "Month Year",
    "credential_id": "Credential ID if mentioned",
    "url": "Verification URL if available",
    "type": "Certification/Course/MOOC"
}}

Return ONLY valid JSON, no other text.""",

    'skill': """Organize and professionally format these skills for an ATS-friendly resume.

User Description: {}

Return a JSON object with categorized skills:
{{
    "prog_languages": "Languages in order of proficiency (e.g., Python, Java, C++)",
    "web_tech": "Web frameworks and technologies (e.g., React.js, Node.js, Django)",
    "databases": "Database systems (e.g., MySQL, MongoDB, PostgreSQL)",
    "mobile_tech": "Mobile and cloud technologies (e.g., Android, Flutter, AWS)",
    "other_tools": "Development tools (e.g., Git, Docker, Linux, Jira)"
}}

GUIDELINES:
- Use official technology names (React.js not react, Node.js not nodejs)
- Order by proficiency within each category
- Include versions only if relevant (Python 3.x, not Python 3.11.2)
Return ONLY valid JSON, no other text.""",

    'summary': """Generate a professional summary for this candidate.

Candidate Info: {}

Return a JSON object with:
{{
    "professional_summary": "2-3 sentence summary highlighting experience level, key technical skills, and career objectives. Should be tailored, specific, and impactful."
}}

GUIDELINES:
- For freshers: Focus on education, technical skills, eagerness to learn
- For experienced: Focus on years of experience, domain expertise, key achievements
- Avoid generic phrases like "seeking challenging opportunities"
- Include specific technologies and measurable achievements
Return ONLY valid JSON, no other text.""",

    'career_objective': """Generate a DREAM CV Career Objective following the exact formula below.

=== DREAM COMPANY & TARGET DETAILS ===
- Dream Company: {dream_company}
- Dream Role: {target_role}
- Dream Technology: {target_technology}
- Dream Cohort: {cohort}

=== CANDIDATE'S RESUME BACKGROUND ===
- Name: {name}
- Education: {education}
- Skills/Technologies: {skills}
- Experience Level: {experience_level}
- Key Projects: {projects}
- Achievements: {achievements}

=== CAREER OBJECTIVE FORMULA (MUST FOLLOW) ===
Structure: "Aspiring [Target Role] + [Education/Status] + [Key Skills] + [Dream Company/Cohort] + [Value Contribution]"

Line 1: Start with WHO you are + Target Role
   Format: "Aspiring [Dream Role] currently pursuing [Degree]..." or "Aspiring [Dream Role] with strong foundation in..."
   
Line 2: Mention KEY skills being developed + Dream Company/Cohort target
   Format: "Focused on gaining expertise in [Relevant Technologies from resume] to secure a role in [Dream Company / Dream Cohort]..."

Line 3: Value you aim to bring
   Format: "Motivated to apply [strengths from resume] to build [scalable/efficient/innovative] [relevant solutions]."

=== STRICT REQUIREMENTS ===
✅ MUST be exactly 2-3 lines (50-80 words max)
✅ MUST mention the specific Dream Role clearly
✅ MUST include 2-3 relevant technologies from the candidate's skills
✅ MUST mention Dream Company or Dream Cohort by name
✅ MUST be specific and intentional, NOT generic
✅ Use future-focused wording (aspiring, aiming, targeting)
✅ Match skills mentioned to what's relevant for the target role

❌ AVOID these generic phrases:
- "seeking opportunities..."
- "hardworking and dedicated..."
- "team player..."
- "looking for challenging position..."
- Starting with "I am..." or "I want..."

=== EXAMPLE OUTPUTS ===

Example 1 (Full-Stack Developer targeting Infosys):
"Aspiring Full-Stack Developer pursuing MCA, focused on MERN stack and backend technologies. Targeting the Infosys Power Programmer cohort and strengthening development skills through real-world projects. Driven to build scalable, user-centric applications aligned with industry best practices."

Example 2 (Data Analyst targeting Deloitte):
"MCA student aspiring to become a Data Analyst at Deloitte. Building strong skills in Python, MySQL, and Power BI for data analytics. Aiming to apply analytical thinking and visualization skills to support business decision-making."

Example 3 (Cloud Engineer targeting AWS/Amazon):
"Motivated MCA student aiming for a Cloud Engineer role at Amazon. Developing expertise in AWS, Docker, and cloud architecture. Committed to building secure, scalable cloud solutions and advancing toward cloud certification pathways."

Return a JSON object with:
{{
    "career_objective": "The generated 2-3 line career objective following the formula above. Must be specific to the Dream Company and include relevant skills from the resume."
}}

CRITICAL: Generate a SPECIFIC career objective tailored to {dream_company} and {target_role}. Use ACTUAL skills from the candidate's resume that are relevant to this role.

Return ONLY valid JSON, no other text."""
}


# Compact resume parsing prompt for when main prompt returns truncated response
RESUME_PARSE_COMPACT_PROMPT = """Extract resume info into JSON. Be concise.

RESUME:
{text_sample}

Return JSON:
{{
    "full_name": "",
    "email": "",
    "phone": "",
    "address": "",
    "linkedin": "",
    "github": "",
    "professional_summary": "2 sentences max",
    "prog_languages": "comma separated",
    "web_tech": "comma separated",
    "databases": "comma separated",
    "mobile_tech": "comma separated",
    "other_tools": "comma separated",
    "qualifications": [{{"degree":"","institution":"","year":"","score":""}}],
    "internships": [{{"company":"","role":"","duration":"","bullets":["point1","point2"]}}],
    "projects": [{{"name":"","tech":"","bullets":["point1","point2"]}}],
    "certifications": [{{"title":"","source":"","date":""}}],
    "experiences": [{{"company":"","role":"","duration":"","bullets":["point1"]}}],
    "leetcode": "",
    "gfg": "",
    "hackerrank": ""
}}

Rules:
- Use "" for missing data
- Use [] for empty arrays
- Max 2-3 bullets per entry
- Return ONLY valid JSON"""
