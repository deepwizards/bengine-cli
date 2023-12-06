const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { isBengineDeployment } = require('../shared/utils'); // Adjust the path as necessary

module.exports = function uninstallExtension(extension_name) {
    console.log(`Uninstalling extension: ${extension_name}...`);

    try {
        isBengineDeployment(); // Check if in a Bengine deployment directory

        const extensionPath = path.join(process.cwd(), 'ext', extension_name);
        const mainModulesPath = path.join(process.cwd(), 'main', 'modules');
        const servicesPath = path.join(process.cwd(), 'services');

        // Run uninstall.sh scripts if they exist
        const uninstallModuleScript = path.join(mainModulesPath, extension_name, 'uninstall.sh');
        if (fs.existsSync(uninstallModuleScript)) {
            execSync(`sh ${uninstallModuleScript}`, { stdio: 'inherit' });
        }

        const uninstallServiceScript = path.join(servicesPath, extension_name, 'uninstall.sh');
        if (fs.existsSync(uninstallServiceScript)) {
            execSync(`sh ${uninstallServiceScript}`, { stdio: 'inherit' });
        }

        // Remove the modules and services directories related to the extension
        const moduleDir = path.join(mainModulesPath, extension_name);
        if (fs.existsSync(moduleDir)) {
            execSync(`rm -rf ${moduleDir}`);
        }

        const serviceDir = path.join(servicesPath, extension_name);
        if (fs.existsSync(serviceDir)) {
            execSync(`rm -rf ${serviceDir}`);
        }

        // Remove the extension directory
        if (fs.existsSync(extensionPath)) {
            execSync(`rm -rf ${extensionPath}`);
        }

        console.log(`Extension ${extension_name} uninstalled successfully.`);

    } catch (error) {
        console.error(`Failed to uninstall extension ${extension_name}:`, error);
    }
};
