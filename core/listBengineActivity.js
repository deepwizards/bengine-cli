// List Bengine core activities and running services

const { execSync } = require('child_process');

module.exports = function listBengineActivity() {
    console.log("List Bengine core activities and running services...");
    try {
        execSync('docker ps', { stdio: 'inherit' });
        console.log("listBengineActivity complete.");
    } catch (error) {
        console.error("Failed to listBengineActivity:", error);
    }
};

