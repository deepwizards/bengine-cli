// Start the Bengine core services

const { execSync } = require('child_process');

module.exports = function startCore() {
    console.log("Start the Bengine core services...");
    try {
        execSync('npm start', { stdio: 'inherit' });
        console.log("startCore complete.");
    } catch (error) {
        console.error("Failed to startCore:", error);
    }
};

