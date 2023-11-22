const { execSync } = require('child_process');

module.exports = function cloneCore() {
    console.log("Cloning bengine core repository...");
    try {
        execSync('git clone https://github.com/deepwizards/bengine.git', { stdio: 'inherit' });
        console.log("Repository cloned successfully.");

        // Placeholder for additional installation processes
        console.log("Running installation process...");
        // TODO: Add installation steps here

        console.log("Installation complete.");
    } catch (error) {
        console.error("Failed to clone repository:", error);
    }
};
