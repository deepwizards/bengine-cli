const { execSync } = require('child_process');
const { isBengineDeployment } = require('../shared/utils'); // Adjust the path as necessary

module.exports = function stopCore() {
    console.log("Stopping the Bengine core services...");

    try {
        isBengineDeployment(); // Check if in a Bengine deployment directory

        execSync('docker-compose -f main/docker-compose.yml down', { stdio: 'inherit' });
        execSync('docker-compose -f services/docker-compose.yml down', { stdio: 'inherit' });
        console.log("Bengine core services stopped successfully.");
    } catch (error) {
        console.error("Failed to stop Bengine core services:", error.message);
    }
};
