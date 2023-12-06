// core/updateCore.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = function updateCore() {
    console.log("Checking for Bengine core updates...");

    try {
        // Determine the current working directory
        const currentDir = process.cwd();
        const bengineConfigFile = path.join(currentDir, 'bengine.json');

        // Check if the bengine.json file exists
        if (!fs.existsSync(bengineConfigFile)) {
            throw new Error('No bengine.json file found. Are you in the right directory?');
        }

        // Read and parse bengine.json
        const bengineConfig = JSON.parse(fs.readFileSync(bengineConfigFile, 'utf8'));
        if (!bengineConfig.core) {
            throw new Error('This directory does not seem to be a Bengine core installation.');
        }

        console.log("Found Bengine core installation. Updating...");

        // Stop Bengine processes before updating
        console.log("Stopping Bengine processes...");
        execSync('bengine core stop', { stdio: 'inherit' });

        // Fetch the latest changes from the repository
        execSync('git fetch', { stdio: 'inherit' });

        // Check if there are updates by comparing local and remote
        const status = execSync('git status -uno').toString();
        if (status.includes('Your branch is up to date')) {
            console.log("Bengine core is already up to date.");

            // Restart Bengine processes if no updates were found
            console.log("Restarting Bengine processes...");
            execSync('bengine core start', { stdio: 'inherit' });

            return;
        }

        // Pull the updates
        execSync('git pull', { stdio: 'inherit' });

        // Install any new dependencies
        execSync('npm install', { stdio: 'inherit' });

        // Restart Bengine processes after updating
        console.log("Restarting Bengine processes...");
        execSync('bengine core start', { stdio: 'inherit' });

        console.log("Bengine core updated successfully.");

    } catch (error) {
        console.error("Failed to update the Bengine core. Error details:", error.message);
        console.log("To resolve this issue:");
        console.log("1. Make sure you are in the correct directory where the Bengine core is installed.");
        console.log("2. Check your internet connection.");
        console.log("3. Ensure you have the necessary permissions.");
        console.log("4. Verify the Bengine core repository is not in a conflicted state.");
    }
};
