const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const archiver = require('archiver');

const execAsync = util.promisify(exec);

module.exports = async function packExtension(projectName) {
    if (!projectName) {
        throw new Error('Project name is required');
    }

    const projectDir = `bengine-${projectName}`;
    const releasesDir = '_releases';
    const projectReleaseDir = path.join(releasesDir, projectName);

    try {
        // Check if the project directory exists
        await fs.access(projectDir);

        // Function to recursively delete node_modules directories
        const deleteNodeModules = async (dir) => {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            for (let entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    if (entry.name === 'node_modules') {
                        await execAsync(`rm -rf "${fullPath}"`);
                    } else {
                        await deleteNodeModules(fullPath);
                    }
                }
            }
        };

        // Delete node_modules directories
        await deleteNodeModules(projectDir);

        // Read version from benfo.json
        const benfoJsonPath = path.join(projectDir, 'benfo.json');
        const benfoJson = JSON.parse(await fs.readFile(benfoJsonPath, 'utf8'));
        const version = benfoJson.version || '0.0.1';

        // Create the project release directory if it doesn't exist
        await fs.mkdir(projectReleaseDir, { recursive: true });

        // Create a zip file of the project directory
        const zipFileName = `${projectDir}-v${version}.zip`;
        const zipFilePath = path.join(projectReleaseDir, zipFileName);
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        return new Promise((resolve, reject) => {
            output.on('close', () => {
                console.log(`Zip file ${zipFilePath} has been created`);
                resolve();
            });

            archive.on('error', (err) => reject(err));

            archive.pipe(output);
            archive.directory(projectDir, false);
            archive.finalize();
        });
    } catch (error) {
        console.error('Error in packExtension:', error.message);
        throw error; // Rethrow the error for the CLI to handle
    }
};
