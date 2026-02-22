import fs from 'fs';

const files = [
    'src/pages/AdminDashboard.jsx',
    'src/pages/AdminDashboardComponents.jsx'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Make backups
    fs.writeFileSync(file + '.bak', content);

    // Background colors
    content = content.replace(/backgroundColor:\s*'#fff'/g, "backgroundColor: 'var(--admin-card-bg)'");
    content = content.replace(/background:\s*'#fff'/g, "background: 'var(--admin-card-bg)'");
    content = content.replace(/backgroundColor:\s*'#f8fafc'/g, "backgroundColor: 'var(--admin-bg)'");
    content = content.replace(/backgroundColor:\s*'#1e293b'/g, "backgroundColor: 'var(--admin-sidebar-bg)'");
    content = content.replace(/backgroundColor:\s*'#0f172a'/g, "backgroundColor: 'var(--admin-footer-bg)'");
    content = content.replace(/backgroundColor:\s*'#f1f5f9'/g, "backgroundColor: 'var(--admin-table-head)'");
    content = content.replace(/backgroundColor:\s*index\s*%\s*2\s*===\s*0\s*\?\s*'#fff'\s*:\s*'#fafafa'/g, "backgroundColor: index % 2 === 0 ? 'var(--admin-card-bg)' : 'var(--admin-hover)'");

    // Borders
    content = content.replace(/border:\s*'1px solid #e2e8f0'/g, "border: '1px solid var(--admin-border)'");
    content = content.replace(/borderBottom:\s*'1px solid #e2e8f0'/g, "borderBottom: '1px solid var(--admin-border)'");
    content = content.replace(/borderBottom:\s*'2px solid #e2e8f0'/g, "borderBottom: '2px solid var(--admin-border)'");
    content = content.replace(/borderBottom:\s*'1px solid #f1f5f9'/g, "borderBottom: '1px solid var(--admin-border)'");
    content = content.replace(/borderTop:\s*'1px solid #f1f5f9'/g, "borderTop: '1px solid var(--admin-border)'");

    // Text colors
    content = content.replace(/color:\s*'#fff'/g, "color: 'var(--admin-sidebar-text)'");
    content = content.replace(/color:\s*'#1e293b'/g, "color: 'var(--admin-text-main)'");
    content = content.replace(/color:\s*'#64748b'/g, "color: 'var(--admin-text-muted)'");
    content = content.replace(/color:\s*'#475569'/g, "color: 'var(--admin-text-muted)'");
    content = content.replace(/color:\s*'#94a3b8'/g, "color: 'var(--admin-text-muted)'");

    fs.writeFileSync(file, content);
});
console.log('Theme substitution script finished successfully');
