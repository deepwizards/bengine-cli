const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');

module.exports = async function deployExtension(projectName) {
    if (!projectName) {
        throw new Error('Project name is required');
    }

    const projectDir = `bengine-${projectName}`;
    const releasesDir = '_releases';
    const benfoJsonPath = path.join(projectDir, 'benfo.json');
    const token = 'YOUR_GITHUB_TOKEN'; // Replace with your GitHub token

    try {
        // Check if benfo.json exists
        const benfoJson = JSON.parse(await fs.readFile(benfoJsonPath, 'utf8'));
        const version = benfoJson.version || '0.0.1';
        const zipFileName = `${projectDir}-v${version}.zip`;
        const zipFilePath = path.join(releasesDir, projectName, zipFileName);

        // Check if the release already exists
        const checkRelease = async () => {
            const apiUrl = `https://api.github.com/repos/deepwizards/${projectDir}/releases`;
            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `token ${token}`
                }
            });

            const releases = await response.json();
            return releases.some(release => release.tag_name === `v${version}`);
        };

        if (await checkRelease()) {
            throw new Error(`Release v${version} already exists for ${projectName}`);
        }

        // Create Release
        const releaseUrl = `https://api.github.com/repos/deepwizards/${projectDir}/releases`;
        const releaseResponse = await fetch(releaseUrl, {
            method: 'POST',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tag_name: `v${version}`,
                name: `${projectName} v${version}`,
                body: `Release of ${projectName} version ${version}`,
                draft: false,
                prerelease: false,
            }),
        });

        if (!releaseResponse.ok) {
            throw new Error(`Error creating release: ${releaseResponse.statusText}`);
        }

        const releaseData = await releaseResponse.json();

        // Upload Asset
        const uploadUrl = releaseData.upload_url.replace(/{.*}/, '');
        const zipData = await fs.readFile(zipFilePath);
        const uploadResponse = await fetch(`${uploadUrl}?name=${zipFileName}&label=${zipFileName}`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/octet-stream',
            },
            body: zipData
        });

        if (!uploadResponse.ok) {
            throw new Error(`Error uploading release asset: ${uploadResponse.statusText}`);
        }

        console.log(`Release v${version} for ${projectName} created and asset uploaded successfully`);
    } catch (error) {
        console.error('Error in deployExtension:', error.message);
        throw error; // Rethrow the error for the CLI to handle
    }
};
