const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const appsDir = path.join(rootDir, 'apps');

if (!fs.existsSync(appsDir)) {
  console.error("Apps directory not found at " + appsDir);
  process.exit(1);
}

const apps = fs.readdirSync(appsDir);

apps.forEach(app => {
  const appPath = path.join(appsDir, app);
  const srcPath = path.join(appPath, 'src');
  
  if (!fs.existsSync(srcPath)) return;

  const adminPath = path.join(srcPath, 'pages', 'Admin.tsx');
  const appTsxPath = path.join(srcPath, 'App.tsx');

  // 1. Delete Admin.tsx
  if (fs.existsSync(adminPath)) {
    fs.unlinkSync(adminPath);
    console.log(`Deleted: ${adminPath}`);
  }

  // 2. Modify App.tsx
  if (fs.existsSync(appTsxPath)) {
    let appContent = fs.readFileSync(appTsxPath, 'utf8');

    // Remove Admin import
    appContent = appContent.replace(/import\s+{\s*Admin\s*}\s+from\s+['"]\.\/pages\/Admin['"];?\n?/, '');

    // Remove isAdminRoute state and useEffect
    appContent = appContent.replace(/const\s+\[isAdminRoute,\s*setIsAdminRoute\]\s*=\s*useState\(false\);\n?/, '');
    
    appContent = appContent.replace(/useEffect\(\(\)\s*=>\s*{\s*const\s+checkRoute\s*=\s*\(\)\s*=>\s*{[\s\S]*?return\s*\(\)\s*=>\s*{[\s\S]*?};\s*},\s*\[\]\);\n?/g, '');

    // Remove navigateToSite
    appContent = appContent.replace(/const\s+navigateToSite\s*=\s*\(\)\s*=>\s*{[\s\S]*?};\n?/g, '');

    // Remove if (isAdminRoute) return <Admin />
    appContent = appContent.replace(/if\s*\(isAdminRoute\)\s*{\s*return\s*\([\s\S]*?<\/?Admin[\s\S]*?\);\s*}\n?/g, '');

    fs.writeFileSync(appTsxPath, appContent, 'utf8');
    console.log(`Patched: ${appTsxPath}`);
  }
});
console.log("Phase 1 Security Triage completed.");
