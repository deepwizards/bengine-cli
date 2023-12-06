// Install the Bengine core

const { execSync } = require('child_process');

module.exports = function installCore() {
    console.log("Install the Bengine core...");
    try {
        execSync('npm install', { stdio: 'inherit' });
        console.log("installCore complete.");
    } catch (error) {
        console.error("Failed to installCore:", error);
    }
};

