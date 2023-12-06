const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { isBengineDeployment } = require('../shared/utils'); // Adjust the path as necessary

module.exports = function installExtension(extension_name) {
    console.log(`Installing extension: ${extension_name}...`);

    try {
        isBengineDeployment(); // Check if in a Bengine deployment directory

        const extensionRepoUrl = `https://github.com/path/to/${extension_name}.git`; // Adjust this to the actual repo URL
        const extensionPath = path.join(process.cwd(), 'ext', extension_name);

        // Clone the extension repository
        execSync(`git clone ${extensionRepoUrl} ${extensionPath}`, { stdio: 'inherit' });

        // Parse the benfo.json file
        const benfoPath = path.join(extensionPath, 'benfo.json');
        if (!fs.existsSync(benfoPath)) {
            throw new Error('benfo.json not found in the extension directory.');
        }
        const benfo = JSON.parse(fs.readFileSync(benfoPath, 'utf8'));

        // Move modules and services
        if (benfo.modules) {
            execSync(`mv ${path.join(extensionPath, 'modules', '*')} ${path.join(process.cwd(), 'main', 'modules')}`);
        }
        if (benfo.services) {
            execSync(`mv ${path.join(extensionPath, 'services', '*')} ${path.join(process.cwd(), 'services')}`);
        }

        // Run install.sh in the modules and services folders
        if (fs.existsSync(path.join(process.cwd(), 'main', 'modules', 'install.sh'))) {
            execSync(`sh ${path.join(process.cwd(), 'main', 'modules', 'install.sh')}`, { stdio: 'inherit' });
        }
        if (fs.existsSync(path.join(process.cwd(), 'services', 'install.sh'))) {
            execSync(`sh ${path.join(process.cwd(), 'services', 'install.sh')}`, { stdio: 'inherit' });
        }

        console.log(`Extension ${extension_name} installed successfully.`);

    } catch (error) {
        console.error(`Failed to install extension ${extension_name}:`, error);
    }
};
