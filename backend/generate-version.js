// generate-version.js
const fs = require('fs');

function bumpVersion(version) {
    const parts = version.split('.').map(Number);
    if (parts.length !== 3) return "1.0.0"; // fallback

    parts[2]++; // bump PATCH
    return parts.join('.');
}

function generateVersion() {
    try {
        // Load package.json
        const packagePath = 'package.json';
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

        // Get current version
        const currentVersion = packageJson.version || '1.0.0';

        // Bump patch version
        const newVersion = bumpVersion(currentVersion);

        // Save new version back to package.json
        packageJson.version = newVersion;
        fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));

        // Create version.json for frontend
        const versionInfo = {
            version: `v${newVersion}`,
            buildDate: new Date().toISOString()
        };

        fs.writeFileSync('public/version.json', JSON.stringify(versionInfo, null, 2));

        console.log(`✅ Version updated: v${newVersion}`);
    } catch (error) {
        console.error('❌ Error generating version:', error);
    }
}

generateVersion();