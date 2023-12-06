// cli/updateCLI.js
const { execSync } = require('child_process');

module.exports = function updateCLI() {
    console.log("Updating the Bengine CLI...");
    try {
        // Assuming the CLI is a Git repository
        execSync('git pull', { stdio: 'inherit' });
        console.log("Bengine CLI updated successfully.");

        // Any additional steps for CLI update can be added here

    } catch (error) {
        console.error("Failed to update the Bengine CLI:", error);
    }
};
