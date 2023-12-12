const { execSync } = require('child_process');
const { isBengineDeployment } = require('../shared/utils');
const axios = require('axios');

module.exports = function startCore() {
    console.log("Starting the Bengine core services...");

    try {
        isBengineDeployment(); // Check if in a Bengine deployment directory

        execSync('docker-compose -f main/docker-compose.yml up -d', { stdio: 'inherit' });
        execSync('docker-compose -f services/docker-compose.yml up -d', { stdio: 'inherit' });
        console.log("Bengine core services started successfully.");
    } catch (error) {
        console.error("Failed to start Bengine core services:", error.message);
    }
};

// function testEndpoint(url) {
//     try {
//         const response = axios.get(url).then(res => res);
//         return response && response.status === 200;
//     } catch {
//         return false;
//     }
// }
// function runPostInstallTests() {
//     const tests = [testEndpoint('http://localhost:1337/status'), testEndpoint('http://localhost:3000/status')];
//     const results = tests.map(test => test);
//     if (!results.every(status => status)) {
//         throw new Error("One or more tests failed.");
//     }
//     console.log("All tests passed successfully.");
// }