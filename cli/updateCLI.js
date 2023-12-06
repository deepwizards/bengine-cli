// cli/updateCLI.js
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

module.exports = function updateCLI() {
    console.log("Checking for updates to the Bengine CLI...");

    try {
        // Find the global installation path of the CLI
        const cliPath = path.dirname(require.main.filename);

        // Verify that the path contains the .git directory
        if (!fs.existsSync(path.join(cliPath, '.git'))) {
            throw new Error('No .git directory found. Ensure Bengine CLI is installed via git.');
        }

        // Change to the CLI directory
        process.chdir(cliPath);

        // Execute the git fetch command to check for updates
        execSync('git fetch', { stdio: 'inherit' });

        // Check if there are updates by comparing local and remote
        const status = execSync('git status -uno').toString();

        if (status.includes('Your branch is up to date')) {
            console.log("Bengine CLI is already up to date.");
            return;
        }

        console.log("Updating Bengine CLI...");
        execSync('git pull', { stdio: 'inherit' });
        execSync('npm install', { stdio: 'inherit' });
        execSync('npm link', { stdio: 'inherit' });

        console.log("Bengine CLI updated successfully.");

    } catch (error) {
        console.error("Failed to update the Bengine CLI. Error details:", error.message);
        console.log("To resolve this issue:");
        console.log("1. Ensure you have a stable internet connection.");
        console.log("2. Check if you have the necessary permissions (try running with 'sudo' if on Linux/Mac).");
        console.log("3. Make sure that your local repository is not in a conflicted state.");
        console.log("4. If the issue persists, consider manually updating by navigating to the Bengine CLI directory and running 'git pull', 'npm install', and 'npm link'.");
    }
};
