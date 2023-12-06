// Install an extension

const { execSync } = require('child_process');

module.exports = function installExtension() {
    console.log("Install an extension...");
    try {
        execSync('npm install ${extension_name}', { stdio: 'inherit' });
        console.log("installExtension complete.");
    } catch (error) {
        console.error("Failed to installExtension:", error);
    }
};

