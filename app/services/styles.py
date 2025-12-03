"""
CV Styles - CSS styles for PDF generation
DREAM CV format with Garamond font, clean formatting
"""


def get_cv_styles() -> str:
    """
    Get CSS styles optimized for xhtml2pdf PDF generation
    
    DREAM CV design:
    - Garamond font family (college requirement)
    - Section headers with uppercase and underline
    - DREAM Company section styling
    - Skills table with planned skills
    - Digital Existence table layout
    - Declaration section with signature
    - Proper spacing and visual hierarchy
    """
    return '''
    @page {
        size: A4;
        margin: 0.5in 0.6in;
    }
    
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    body {
        font-family: Garamond, "Times New Roman", Georgia, serif;
        font-size: 10pt;
        line-height: 1.2;
        color: #000;
        background: #fff;
    }
    
    /* Main container */
    .cv-container {
        width: 100%;
        max-width: 21cm;
        margin: 0 auto;
        background: #fff;
        padding: 0;
    }
    
    /* ========== HEADER SECTION ========== */
    .header-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 10pt;
    }
    
    .header-table td {
        vertical-align: top;
        padding: 0;
    }
    
    .header-left {
        padding-right: 15pt;
    }
    
    .photo-cell {
        width: 3cm;
        text-align: right;
    }
    
    .profile-photo {
        width: 3cm;
        height: 3.6cm;
        object-fit: cover;
        border: 0.5pt solid #666;
    }
    
    .name {
        font-size: 18pt;
        font-weight: bold;
        color: #000;
        margin-bottom: 2pt;
        letter-spacing: 0.5pt;
    }
    
    .professional-title {
        font-size: 11pt;
        font-style: italic;
        color: #333;
        margin-bottom: 6pt;
    }
    
    .contact-section {
        font-size: 9pt;
        line-height: 1.4;
    }
    
    .contact-item {
        margin-bottom: 1pt;
    }
    
    /* ========== SECTION STYLING ========== */
    .section {
        margin-bottom: 8pt;
        page-break-inside: avoid;
    }
    
    .section-header {
        font-weight: bold;
        font-size: 11pt;
        padding: 2pt 0;
        margin-bottom: 5pt;
        text-transform: uppercase;
        letter-spacing: 1pt;
        border-bottom: 1pt solid #000;
        color: #000;
    }
    
    .section-content {
        padding: 3pt 0;
    }
    
    /* ========== DREAM COMPANY SECTION ========== */
    .dream-section {
        margin-bottom: 10pt;
        background: #f9f9f9;
        padding: 5pt 8pt;
        border: 0.5pt solid #ddd;
    }
    
    .dream-section .section-header {
        border-bottom: 1pt solid #000;
        background: transparent;
    }
    
    .dream-table {
        border-collapse: collapse;
        font-size: 10pt;
    }
    
    .dream-table td {
        padding: 2pt 5pt 2pt 0;
        vertical-align: top;
    }
    
    .dream-label {
        font-weight: bold;
        color: #333;
    }
    
    .dream-value {
        font-weight: normal;
        color: #000;
    }
    
    /* ========== CAREER OBJECTIVE ========== */
    .summary-text {
        font-size: 10pt;
        line-height: 1.3;
        text-align: justify;
    }
    
    /* ========== EDUCATION ========== */
    .education-entry {
        margin-bottom: 6pt;
    }
    
    .edu-table {
        border-collapse: collapse;
    }
    
    .edu-table td {
        padding: 0;
        vertical-align: top;
    }
    
    .edu-degree {
        font-weight: bold;
        font-size: 10pt;
    }
    
    .edu-duration {
        text-align: right;
        font-size: 10pt;
        white-space: nowrap;
    }
    
    .edu-institution {
        font-size: 9.5pt;
        color: #333;
        margin-top: 1pt;
    }
    
    /* ========== SKILLS TABLE ========== */
    .skills-table {
        border-collapse: collapse;
        font-size: 10pt;
    }
    
    .skills-table tr {
        border-bottom: 0.5pt solid #eee;
    }
    
    .skill-label-cell {
        font-weight: bold;
        padding: 3pt 8pt 3pt 0;
        vertical-align: top;
        white-space: nowrap;
    }
    
    .skill-value-cell {
        padding: 3pt 0;
        vertical-align: top;
    }
    
    .skill-value-cell.planned {
        font-style: italic;
        color: #555;
    }
    
    /* ========== ENTRY STYLING (Experience, Internships, Projects) ========== */
    .entry {
        margin-bottom: 6pt;
        page-break-inside: avoid;
    }
    
    .entry:last-child {
        margin-bottom: 0;
    }
    
    .entry-header-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 2pt;
    }
    
    .entry-header-table td {
        padding: 0;
        vertical-align: top;
    }
    
    .entry-title {
        font-weight: bold;
        font-size: 10pt;
        color: #000;
    }
    
    .entry-company {
        font-size: 10pt;
        color: #000;
    }
    
    .entry-role {
        font-size: 10pt;
        font-style: italic;
        color: #333;
    }
    
    .entry-mode {
        font-size: 9pt;
        color: #555;
    }
    
    .entry-duration {
        font-size: 10pt;
        color: #000;
        text-align: right;
        white-space: nowrap;
    }
    
    /* ========== EXPERIENCE ENTRY STYLING ========== */
    .experience-entry {
        padding-bottom: 6pt;
        margin-bottom: 6pt;
        border-bottom: 0.5pt dashed #999;
    }
    
    .experience-entry:last-child {
        border-bottom: none;
        padding-bottom: 0;
        margin-bottom: 0;
    }
    
    /* ========== INTERNSHIP ENTRY STYLING ========== */
    .internship-entry {
        padding-bottom: 6pt;
        margin-bottom: 6pt;
        border-bottom: 0.5pt dashed #999;
    }
    
    .internship-entry:last-child {
        border-bottom: none;
        padding-bottom: 0;
        margin-bottom: 0;
    }
    
    /* ========== PROJECT STYLING ========== */
    .project-entry {
        padding-bottom: 6pt;
        margin-bottom: 6pt;
        border-bottom: 0.5pt dashed #999;
    }
    
    .project-entry:last-child {
        border-bottom: none;
        padding-bottom: 0;
        margin-bottom: 0;
    }
    
    .project-entry .tech-stack {
        font-size: 9.5pt;
        color: #333;
        margin: 2pt 0;
    }
    
    .project-link {
        font-size: 9pt;
        color: #555;
        margin-top: 2pt;
    }
    
    /* ========== BULLET LIST ========== */
    .bullet-list {
        margin: 2pt 0 0 8pt;
        padding: 0;
    }
    
    .bullet-item {
        font-size: 10pt;
        line-height: 1.3;
        margin-bottom: 2pt;
        padding-left: 5pt;
    }
    
    /* ========== CERTIFICATIONS ========== */
    .cert-entry {
        margin-bottom: 4pt;
        font-size: 10pt;
    }
    
    .cert-title {
        font-weight: bold;
    }
    
    .cert-source {
        font-size: 10pt;
    }
    
    .planned-section {
        margin-top: 8pt;
        padding-top: 5pt;
        border-top: 0.5pt dashed #ccc;
    }
    
    .planned-header {
        font-weight: bold;
        font-size: 9.5pt;
        color: #333;
        margin-bottom: 3pt;
    }
    
    .cert-entry.planned {
        font-style: italic;
        color: #555;
    }
    
    /* ========== DIGITAL EXISTENCE ========== */
    .digital-table {
        border-collapse: collapse;
        font-size: 10pt;
    }
    
    .digital-table tr {
        border-bottom: 0.5pt solid #eee;
    }
    
    .digital-label {
        font-weight: bold;
        padding: 3pt 8pt 3pt 0;
        vertical-align: top;
    }
    
    .digital-value {
        padding: 3pt 0;
        vertical-align: top;
    }
    
    /* ========== WORK EXPERIENCE FALLBACK ========== */
    .no-experience {
        font-size: 10pt;
        font-style: italic;
        color: #555;
    }
    
    /* ========== ACHIEVEMENTS ========== */
    .achievements-content {
        font-size: 10pt;
        line-height: 1.3;
    }
    
    /* ========== EXTRACURRICULAR ========== */
    .extra-content {
        font-size: 10pt;
        line-height: 1.3;
    }
    
    /* ========== LANGUAGES TABLE ========== */
    .language-table {
        border-collapse: collapse;
        font-size: 10pt;
        margin-top: 3pt;
    }
    
    .language-table th,
    .language-table td {
        border: 0.5pt solid #ccc;
        padding: 4pt 8pt;
        text-align: center;
    }
    
    .lang-header-row {
        background-color: #f5f5f5;
    }
    
    .lang-header-row th {
        font-weight: bold;
        font-size: 9pt;
    }
    
    .lang-name {
        text-align: left;
        font-weight: 500;
    }
    
    .lang-ability {
        font-size: 11pt;
    }
    
    /* ========== SUBSECTION HEADERS ========== */
    .subsection-header {
        font-size: 10pt;
        font-weight: bold;
        margin-top: 6pt;
        margin-bottom: 3pt;
    }
    
    .community-text {
        font-size: 10pt;
        line-height: 1.3;
    }
    
    /* ========== DECLARATION ========== */
    .declaration-section {
        margin-top: 15pt;
        page-break-inside: avoid;
    }
    
    .declaration-text {
        font-size: 10pt;
        line-height: 1.3;
        margin-bottom: 12pt;
    }
    
    .declaration-footer {
        border-collapse: collapse;
        font-size: 10pt;
    }
    
    .declaration-footer td {
        padding: 5pt 0;
        vertical-align: top;
    }
    
    .signature-cell {
        text-align: right;
    }
    
    /* ========== LINKS ========== */
    a {
        color: #000;
        text-decoration: none;
    }
    '''

