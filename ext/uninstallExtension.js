// Uninstall an extension

const { execSync } = require('child_process');

module.exports = function uninstallExtension() {
    console.log("Uninstall an extension...");
    try {
        execSync('npm uninstall ${extension_name}', { stdio: 'inherit' });
        console.log("uninstallExtension complete.");
    } catch (error) {
        console.error("Failed to uninstallExtension:", error);
    }
};

