const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = function listBengineActivity() {
    console.log("Listing Bengine core activities and running services...");

    try {
        // Filter Docker containers related to Bengine
        const bengineDockerContainers = execSync("docker ps --filter 'name=bengine-*' --format '{{.Names}}'").toString().trim().split('\n');
        console.log("Bengine Docker Containers:");
        console.log(bengineDockerContainers.join('\n'));

        // Get Bengine version
        try {
            const benfoPath = path.join(process.cwd(), 'benfo.json'); // Update the path as needed
            const benfoData = fs.readFileSync(benfoPath, 'utf8');
            const benfo = JSON.parse(benfoData);
        
            console.log("Bengine Version:");
            console.log(benfo.version); // Assuming 'version' is the key for the version number in benfo.json
        } catch (versionError) {
            console.error("Failed to retrieve Bengine version from benfo.json:", versionError);
        }

        // Get CPU and memory stats for each Bengine container
        console.log("Memory and CPU stats for Bengine Containers:");
        bengineDockerContainers.forEach(containerName => {
            try {
                const stats = execSync(`docker stats --no-stream --format "{{.Container}}: {{.CPUPerc}} CPU, {{.MemUsage}}" ${containerName}`).toString();
                console.log(stats);
            } catch (statsError) {
                console.error(`Failed to get stats for container ${containerName}:`, statsError);
            }
        });

        console.log("Bengine core activities and running services listed successfully.");

    } catch (error) {
        console.error("Failed to list Bengine core activities and running services:", error);
    }
};
