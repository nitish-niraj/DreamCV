// DREAM CV Generator - Live Preview Module

/**
 * Update the live preview panel with current form data
 */
function updateLivePreview() {
    const data = collectFormData();
    const preview = document.getElementById('livePreview');
    
    if (!data.full_name) {
        preview.innerHTML = `
            <div class="preview-placeholder">
                <i class="fas fa-file-alt fa-3x text-muted"></i>
                <p>Your CV preview will appear here as you fill in the form</p>
            </div>
        `;
        return;
    }
    
    // Update status message for test assertions
    if (typeof updateStatusMessage === 'function') {
        updateStatusMessage('Live CV Updated Successfully', 'success', 2000);
    }
    
    const photoSrc = document.querySelector('#photoPreview img')?.src || '';
    const photoHtml = photoSrc ? `<img src="${photoSrc}" class="cv-photo" alt="Photo" style="width: 70px; height: 85px; object-fit: cover; border: 1px solid #2c3e50;">` : '';
    
    preview.innerHTML = `
        <div class="preview-cv" style="font-family: Garamond, Georgia, serif; font-size: 8px; line-height: 1.3; color: #000;">
            
            <!-- 1. HEADER: Name + Contact (Left), Photo (Right) -->
            <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 8px;">
                <div>
                    <div style="font-size: 12px; font-weight: bold; margin-bottom: 3px;">${data.full_name}</div>
                    <div style="font-size: 8px;">
                        ${data.phone || ''}${data.email ? ` | ${data.email}` : ''}${data.linkedin ? ` | LinkedIn` : ''}${data.github ? ` | GitHub` : ''}
                    </div>
                </div>
                ${photoHtml ? `<div>${photoHtml}</div>` : ''}
            </div>
            
            <!-- 2. CAREER OBJECTIVE -->
            ${data.professional_summary ? `
            <div style="margin-bottom: 8px;">
                <div class="cv-section-title" style="font-size: 9px; font-weight: bold; border-bottom: 1px solid #000; margin-bottom: 4px;">CAREER OBJECTIVE</div>
                <p style="font-size: 8px; margin: 0; text-align: justify;">${data.professional_summary}</p>
            </div>
            ` : ''}
            
            <!-- 3. TECHNICAL SKILLS -->
            ${data.prog_languages || data.web_tech || data.databases || data.mobile_tech || data.other_tools ? `
            <div style="margin-bottom: 8px;">
                <div class="cv-section-title" style="font-size: 9px; font-weight: bold; border-bottom: 1px solid #000; margin-bottom: 4px;">TECHNICAL SKILLS</div>
                <div style="font-size: 8px;">
                    ${data.prog_languages ? `<div><strong>Programming:</strong> ${data.prog_languages}</div>` : ''}
                    ${data.web_tech ? `<div><strong>Web Technologies:</strong> ${data.web_tech}</div>` : ''}
                    ${data.databases ? `<div><strong>Databases:</strong> ${data.databases}</div>` : ''}
                    ${data.mobile_tech ? `<div><strong>Mobile/Cloud:</strong> ${data.mobile_tech}</div>` : ''}
                    ${data.other_tools ? `<div><strong>Tools:</strong> ${data.other_tools}</div>` : ''}
                </div>
            </div>
            ` : ''}
            
            <!-- 4. WORK EXPERIENCE -->
            ${data.experiences && data.experiences.length > 0 ? `
            <div style="margin-bottom: 8px;">
                <div class="cv-section-title" style="font-size: 9px; font-weight: bold; border-bottom: 1px solid #000; margin-bottom: 4px;">WORK EXPERIENCE</div>
                ${data.experiences.map(e => `
                    <div style="margin-bottom: 4px;">
                        <strong>${e.role}</strong> <span style="float: right;">[${e.duration}]</span>
                        <div style="color: #333;">${e.company}${e.salary ? ` | ${e.salary}` : ''}</div>
                        ${e.bullets && e.bullets.length > 0 ? `
                            <ul style="margin: 2px 0 0 15px; padding: 0; font-size: 7px; color: #333;">
                                ${e.bullets.map(b => `<li style="margin-bottom: 1px;">${b}</li>`).join('')}
                            </ul>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            <!-- 5. INTERNSHIPS -->
            ${data.internships && data.internships.length > 0 ? `
            <div style="margin-bottom: 8px;">
                <div class="cv-section-title" style="font-size: 9px; font-weight: bold; border-bottom: 1px solid #000; margin-bottom: 4px;">INTERNSHIPS</div>
                ${data.internships.map(i => `
                    <div style="margin-bottom: 4px;">
                        <strong>${i.company}</strong> — ${i.role || 'Intern'} <span style="float: right;">[${i.duration}]</span>
                        ${i.bullets && i.bullets.length > 0 ? `
                            <ul style="margin: 2px 0 0 15px; padding: 0; font-size: 7px; color: #333;">
                                ${i.bullets.map(b => `<li style="margin-bottom: 1px;">${b}</li>`).join('')}
                            </ul>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            <!-- 6. PROJECTS -->
            ${data.projects && data.projects.length > 0 ? `
            <div style="margin-bottom: 8px;">
                <div class="cv-section-title" style="font-size: 9px; font-weight: bold; border-bottom: 1px solid #000; margin-bottom: 4px;">PROJECTS / APPLICATION DEVELOPMENT</div>
                ${data.projects.map(p => `
                    <div style="margin-bottom: 4px;">
                        <strong>${p.name}</strong>${p.role ? ` | ${p.role}` : ''}
                        ${p.bullets && p.bullets.length > 0 ? `
                            <ul style="margin: 2px 0 0 15px; padding: 0; font-size: 7px; color: #333;">
                                ${p.bullets.map(b => `<li style="margin-bottom: 1px;">${b}</li>`).join('')}
                            </ul>
                        ` : ''}
                        ${p.tech ? `<div style="font-size: 7px; color: #666; margin-left: 8px;"><em>Tech: ${p.tech}</em></div>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            <!-- 7. ACHIEVEMENTS -->
            ${data.achievements ? `
            <div style="margin-bottom: 8px;">
                <div class="cv-section-title" style="font-size: 9px; font-weight: bold; border-bottom: 1px solid #000; margin-bottom: 4px;">ACHIEVEMENTS</div>
                <div style="font-size: 8px;">${data.achievements}</div>
            </div>
            ` : ''}
            
            <!-- 8. EDUCATION -->
            ${data.qualifications && data.qualifications.length > 0 ? `
            <div style="margin-bottom: 8px;">
                <div class="cv-section-title" style="font-size: 9px; font-weight: bold; border-bottom: 1px solid #000; margin-bottom: 4px;">EDUCATION</div>
                <table style="width: 100%; font-size: 7px; border-collapse: collapse;">
                    <tr style="background: #f0f0f0;">
                        <th style="border: 1px solid #ccc; padding: 2px; text-align: left;">Degree</th>
                        <th style="border: 1px solid #ccc; padding: 2px; text-align: left;">Institution</th>
                        <th style="border: 1px solid #ccc; padding: 2px; text-align: left;">Duration</th>
                        <th style="border: 1px solid #ccc; padding: 2px; text-align: left;">Score</th>
                    </tr>
                    ${data.qualifications.map(q => `
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 2px;">${q.degree || ''}</td>
                        <td style="border: 1px solid #ddd; padding: 2px;">${q.institution || ''}${q.board ? ` (${q.board})` : ''}</td>
                        <td style="border: 1px solid #ddd; padding: 2px;">[${q.duration || q.year || ''}]</td>
                        <td style="border: 1px solid #ddd; padding: 2px;">${q.score || '-'}</td>
                    </tr>
                    `).join('')}
                </table>
            </div>
            ` : ''}
            
            <!-- 9. CERTIFICATIONS -->
            ${data.certifications && data.certifications.length > 0 ? `
            <div style="margin-bottom: 8px;">
                <div class="cv-section-title" style="font-size: 9px; font-weight: bold; border-bottom: 1px solid #000; margin-bottom: 4px;">CERTIFICATIONS</div>
                ${data.certifications.map(c => `
                    <div style="margin-bottom: 3px;">
                        <strong>${c.title}</strong> <span style="float: right;">[${c.date || ''}]</span>
                        <div style="color: #333; font-size: 7px;">${c.source}${c.credential_id ? ` | ID: ${c.credential_id}` : ''}</div>
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            <!-- 10. DIGITAL PROFILES -->
            ${data.hackerrank || data.leetcode || data.tech_events || data.community_associations ? `
            <div style="margin-bottom: 8px;">
                <div class="cv-section-title" style="font-size: 9px; font-weight: bold; border-bottom: 1px solid #000; margin-bottom: 4px;">DIGITAL PROFILES</div>
                <div style="font-size: 8px;">
                    ${data.hackerrank ? `<div><strong>HackerRank:</strong> ${data.hackerrank}${data.hackerrank_rank ? ` (${data.hackerrank_rank})` : ''}</div>` : ''}
                    ${data.leetcode ? `<div><strong>LeetCode:</strong> ${data.leetcode}</div>` : ''}
                    ${data.tech_events ? `<div><strong>Competitions:</strong> ${data.tech_events}</div>` : ''}
                    ${data.community_associations ? `<div><strong>Community:</strong> ${data.community_associations}</div>` : ''}
                </div>
            </div>
            ` : ''}
            
            <!-- 11. LANGUAGE PROFICIENCY -->
            ${data.languages && data.languages.length > 0 ? `
            <div style="margin-bottom: 8px;">
                <div class="cv-section-title" style="font-size: 9px; font-weight: bold; border-bottom: 1px solid #000; margin-bottom: 4px;">LANGUAGE PROFICIENCY</div>
                <div style="font-size: 8px;">
                    ${data.languages.map(l => `<div>${l.name} — ${l.abilities || 'Read, Write, Speak'}</div>`).join('')}
                </div>
            </div>
            ` : ''}
            
            <!-- 12. EXTRA-CURRICULAR ACTIVITIES -->
            ${data.community_activities || data.responsibilities && data.responsibilities.length > 0 ? `
            <div style="margin-bottom: 8px;">
                <div class="cv-section-title" style="font-size: 9px; font-weight: bold; border-bottom: 1px solid #000; margin-bottom: 4px;">EXTRA-CURRICULAR ACTIVITIES</div>
                ${data.responsibilities && data.responsibilities.length > 0 ? 
                    data.responsibilities.map(r => `
                        <div style="margin-bottom: 3px;">
                            <strong>${r.role}</strong> <span style="float: right;">[${r.duration}]</span>
                            ${r.bullets && r.bullets.length > 0 ? `
                                <ul style="margin: 2px 0 0 15px; padding: 0; font-size: 7px; color: #333;">
                                    ${r.bullets.map(b => `<li style="margin-bottom: 1px;">${b}</li>`).join('')}
                                </ul>
                            ` : ''}
                        </div>
                    `).join('') : ''}
                ${data.community_activities ? `<div style="font-size: 8px;"><strong>Community:</strong> ${data.community_activities}</div>` : ''}
            </div>
            ` : ''}
        </div>
    `;
}

// Export for module use
window.CVPreview = {
    updateLivePreview
};
