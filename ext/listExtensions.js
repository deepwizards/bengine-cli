// List all extensions and their information

const { execSync } = require('child_process');

module.exports = function listExtensions() {
    console.log("List all extensions and their information...");
    try {
        execSync('npm list --depth=0', { stdio: 'inherit' });
        console.log("listExtensions complete.");
    } catch (error) {
        console.error("Failed to listExtensions:", error);
    }
};

