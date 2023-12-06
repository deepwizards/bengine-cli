// Stop the Bengine core services

const { execSync } = require('child_process');

module.exports = function stopCore() {
    console.log("Stop the Bengine core services...");
    try {
        execSync('npm stop', { stdio: 'inherit' });
        console.log("stopCore complete.");
    } catch (error) {
        console.error("Failed to stopCore:", error);
    }
};

