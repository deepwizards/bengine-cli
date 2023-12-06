const { execSync } = require('child_process');
const { isBengineDeployment } = require('../shared/utils');

module.exports = function startCore() {
    console.log("Starting the Bengine core services...");

    try {
        isBengineDeployment(); // Check if in a Bengine deployment directory

        execSync('npm start', { stdio: 'inherit' });
        console.log("Bengine core services started successfully.");
    } catch (error) {
        console.error("Failed to start Bengine core services:", error.message);
    }
};
