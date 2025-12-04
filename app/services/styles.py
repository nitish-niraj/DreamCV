"""
CV Styles - CSS styles for PDF generation
DREAM CV format with EB Garamond font, LaTeX-style formatting
Professional layout matching LaTeX tcolorbox style
"""


def get_cv_styles() -> str:
    """
    Get CSS styles optimized for xhtml2pdf PDF generation
    
    DREAM CV design (LaTeX-inspired):
    - EB Garamond font family for professional look
    - Section headers with horizontal rule separators
    - Blue tcolorbox-style DREAM Company section
    - Clean table layouts for skills and experience
    - Proper spacing and visual hierarchy
    - Photo in header (right side)
    - Contact info on left side
    """
    return '''
    @page {
        size: A4;
        margin: 0.6in;
    }
    
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    body {
        font-family: "EB Garamond", Garamond, "Times New Roman", Georgia, serif;
        font-size: 10pt;
        line-height: 1.25;
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
        margin-bottom: 12pt;
    }
    
    .header-table td {
        vertical-align: top;
        padding: 0;
    }
    
    .header-left {
        padding-right: 10pt;
    }
    
    .photo-cell {
        width: 2.8cm;
        text-align: right;
    }
    
    .profile-photo {
        width: 2.8cm;
        height: 3.4cm;
        object-fit: cover;
        border: 1pt solid #333;
    }
    
    .name {
        font-size: 20pt;
        font-weight: bold;
        color: #000;
        margin-bottom: 4pt;
        letter-spacing: 0.5pt;
    }
    
    .contact-section {
        font-size: 9.5pt;
        line-height: 1.4;
        margin-top: 4pt;
    }
    
    .contact-line {
        margin-bottom: 1pt;
    }
    
    .contact-separator {
        margin: 0 6pt;
        color: #666;
    }
    
    /* ========== HORIZONTAL RULE SEPARATOR ========== */
    .section-rule {
        border: none;
        border-top: 0.5pt solid #000;
        margin: 8pt 0 6pt 0;
    }
    
    /* ========== SECTION STYLING ========== */
    .section {
        margin-bottom: 6pt;
        page-break-inside: avoid;
    }
    
    .section-header {
        font-weight: bold;
        font-size: 11pt;
        padding: 0 0 3pt 0;
        margin-bottom: 5pt;
        text-transform: uppercase;
        letter-spacing: 1.5pt;
        border-bottom: 0.5pt solid #000;
        color: #000;
    }
    
    .section-content {
        padding: 2pt 0;
    }
    
    /* ========== DREAM COMPANY SECTION (Blue Box) ========== */
    .dream-section {
        margin-bottom: 10pt;
        background: #e8f4fc;
        padding: 8pt 10pt;
        border: 1pt solid #3498db;
        border-left: 3pt solid #2980b9;
    }
    
    .dream-section .section-header {
        color: #2c3e50;
        border-bottom: 0.5pt solid #2980b9;
        margin-bottom: 6pt;
        padding-bottom: 3pt;
    }
    
    .dream-table {
        border-collapse: collapse;
        font-size: 10pt;
        width: 100%;
    }
    
    .dream-table td {
        padding: 2pt 8pt 2pt 0;
        vertical-align: top;
    }
    
    .dream-label {
        font-weight: bold;
        color: #2c3e50;
    }
    
    .dream-value {
        font-weight: normal;
        color: #000;
    }
    
    /* ========== CAREER OBJECTIVE ========== */
    .summary-text {
        font-size: 10pt;
        line-height: 1.35;
        text-align: justify;
    }
    
    /* ========== EDUCATION ========== */
    .education-entry {
        margin-bottom: 5pt;
    }
    
    .edu-table {
        border-collapse: collapse;
        width: 100%;
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
        font-style: italic;
        white-space: nowrap;
    }
    
    .edu-institution {
        font-size: 9.5pt;
        color: #333;
        margin-top: 1pt;
        padding-left: 8pt;
    }
    
    /* ========== SKILLS TABLE ========== */
    .skills-table {
        border-collapse: collapse;
        font-size: 10pt;
        width: 100%;
    }
    
    .skills-table tr {
        border-bottom: 0.5pt dotted #ccc;
    }
    
    .skills-table tr:last-child {
        border-bottom: none;
    }
    
    .skill-label-cell {
        font-weight: bold;
        padding: 3pt 10pt 3pt 0;
        vertical-align: top;
        white-space: nowrap;
        width: 35%;
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
        font-style: italic;
    }
    
    .entry-duration {
        font-size: 10pt;
        font-style: italic;
        color: #000;
        text-align: right;
        white-space: nowrap;
    }
    
    /* ========== EXPERIENCE ENTRY STYLING ========== */
    .experience-entry {
        padding-bottom: 5pt;
        margin-bottom: 5pt;
    }
    
    .experience-entry:last-child {
        padding-bottom: 0;
        margin-bottom: 0;
    }
    
    /* ========== INTERNSHIP ENTRY STYLING ========== */
    .internship-entry {
        padding-bottom: 5pt;
        margin-bottom: 5pt;
    }
    
    .internship-entry:last-child {
        padding-bottom: 0;
        margin-bottom: 0;
    }
    
    /* ========== PROJECT STYLING ========== */
    .project-entry {
        padding-bottom: 5pt;
        margin-bottom: 5pt;
    }
    
    .project-entry:last-child {
        padding-bottom: 0;
        margin-bottom: 0;
    }
    
    .project-entry .tech-stack {
        font-size: 9.5pt;
        color: #333;
        margin: 2pt 0;
        padding-left: 8pt;
    }
    
    .project-link {
        font-size: 9pt;
        color: #555;
        margin-top: 2pt;
        padding-left: 8pt;
    }
    
    /* ========== BULLET LIST ========== */
    .bullet-list {
        margin: 2pt 0 0 8pt;
        padding: 0;
    }
    
    .bullet-item {
        font-size: 10pt;
        line-height: 1.3;
        margin-bottom: 1pt;
        padding-left: 6pt;
    }
    
    /* ========== CERTIFICATIONS ========== */
    .cert-entry {
        margin-bottom: 3pt;
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
        border-top: 0.5pt dashed #999;
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
        width: 100%;
    }
    
    .digital-table tr {
        border-bottom: 0.5pt dotted #ddd;
    }
    
    .digital-table tr:last-child {
        border-bottom: none;
    }
    
    .digital-label {
        font-weight: bold;
        padding: 2pt 8pt 2pt 0;
        vertical-align: top;
        width: 25%;
    }
    
    .digital-value {
        padding: 2pt 0;
        vertical-align: top;
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
        width: 100%;
    }
    
    .language-table th,
    .language-table td {
        border: 0.5pt solid #999;
        padding: 4pt 8pt;
        text-align: center;
    }
    
    .lang-header-row {
        background-color: #f0f0f0;
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

