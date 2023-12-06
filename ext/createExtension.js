const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

const readmeTemplate = require('./tpl/readmeTemplate');
const indexJsTemplate = require('./tpl/indexJsTemplate');
const indexPugTemplate = require('./tpl/indexPugTemplate');
const appJsTemplate = require('./tpl/appJsTemplate');

module.exports = async function createExtension(extensionName) {
    if (!extensionName) {
        throw new Error('Extension name is required');
    }

    const baseDir = `bengine-${extensionName}`;

    try {
        console.log(`Creating base directory for ${extensionName}`);
        await fs.mkdir(baseDir, { recursive: true });

        const benfoJson = {
            extension_name: `bengine-${extensionName}`,
            description: `extension for bengine called ${extensionName}`,
            modules: [extensionName],
            services: [extensionName],
            datasets: [],
            version: "0.0.1"
        };
        console.log(`Creating benfo.json for ${extensionName}`);
        await fs.writeFile(path.join(baseDir, 'benfo.json'), JSON.stringify(benfoJson, null, 4));

        console.log(`Creating README.md for ${extensionName}`);
        const readmeContent = readmeTemplate(extensionName);
        await fs.writeFile(path.join(baseDir, 'README.md'), readmeContent);

        const modulesDir = path.join(baseDir, 'modules', extensionName);
        const servicesDir = path.join(baseDir, 'services', extensionName);

        console.log(`Creating module and service directories for ${extensionName}`);
        await fs.mkdir(modulesDir, { recursive: true });
        await fs.mkdir(path.join(modulesDir, 'views'), { recursive: true });
        await fs.mkdir(servicesDir, { recursive: true });

        console.log(`Creating module files for ${extensionName}`);
        const indexJsContent = indexJsTemplate(extensionName);
        await fs.writeFile(path.join(modulesDir, 'index.js'), indexJsContent);

        const indexPugContent = indexPugTemplate(extensionName);
        await fs.writeFile(path.join(modulesDir, 'views', 'index.pug'), indexPugContent);

        console.log(`Creating service files for ${extensionName}`);
        const appJsContent = appJsTemplate(extensionName);
        await fs.writeFile(path.join(servicesDir, 'app.js'), appJsContent);

        console.log(`Initializing npm and installing dependencies for ${extensionName}`);
        await execAsync(`cd ${servicesDir} && npm init -y && npm i --save express body-parser`);

        console.log(`Creating .gitignore for ${extensionName}`);
        await fs.writeFile(path.join(baseDir, '.gitignore'), 'node_modules/');

        console.log(`Extension scaffold for '${extensionName}' is complete.`);
    } catch (error) {
        console.error(`Error in createExtension for ${extensionName}:`, error);
        throw error;  // Rethrowing the error for the caller to handle
    }
};
