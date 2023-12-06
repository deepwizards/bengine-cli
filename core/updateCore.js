// core/updateCore.js
const { execSync } = require('child_process');

module.exports = function updateCore() {
    console.log("Updating the Bengine core...");
    try {
        // Assuming the core is a Git repository
        execSync('cd path/to/bengine/core && git pull', { stdio: 'inherit' });
        console.log("Bengine core updated successfully.");

        // Any additional steps for core update can be added here

    } catch (error) {
        console.error("Failed to update the Bengine core:", error);
    }
};
