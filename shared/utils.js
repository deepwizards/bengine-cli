const fs = require('fs');
const path = require('path');

// Function to check if the current directory is a Bengine deployment
function isBengineDeployment() {
    const bengineIndicator = 'bengine.json'; // Name of the file that indicates a Bengine deployment
    const currentDir = process.cwd();
    const bengineFilePath = path.join(currentDir, bengineIndicator);

    if (!fs.existsSync(bengineFilePath)) {
        throw new Error('No Bengine deployment found in the current directory.');
    }
}

module.exports = {
    isBengineDeployment
};
