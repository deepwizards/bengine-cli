const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

module.exports = async function createExtension(extensionName) {
    if (!extensionName) {
        throw new Error('Extension name is required');
    }

    const baseDir = `bengine-${extensionName}`;

    try {
        // Create the base directory
        await fs.mkdir(baseDir, { recursive: true });

        // Create benfo.json
        const benfoJson = {
            extension_name: `bengine-${extensionName}`,
            description: `extension for bengine called ${extensionName}`,
            modules: [extensionName],
            services: [extensionName],
            datasets: [],
            version: "0.0.1"
        };
        await fs.writeFile(path.join(baseDir, 'benfo.json'), JSON.stringify(benfoJson, null, 4));

        // Create README.md
        const readmeContent = `# bengine-${extensionName}

        Welcome to \`bengine-${extensionName}\`, add your general description of the extension here.

        ## Features

        - **Feature**: Add your list of features here

        ## Getting Started

        ### Cloning the Repository

        Clone this repository to get started:

        \`git clone https://github.com/deepwizards/bengine-${extensionName}.git\`

        ## Contribution Guidelines

        Contribute to \`bengine-${extensionName}\` by following these steps:

        1. **Create a Feature Branch**:
        \`git checkout -b feature/your-feature-name\`

        2. **Commit Your Changes**:
        \`git commit -am "Add a new feature"\`

        3. **Push to the Branch**:
        \`git push origin feature/your-feature-name\`

        4. **Open a Pull Request**:
        Create a PR against the \`dev\` branch.

        5. **Wait for Review and Approval**:
        A maintainer will review your PR.

        6. **Merging to Main**:
        Approved PRs will be merged into the \`main\` branch.

        ## Contribution Best Practices

        - Follow coding standards and best practices.
        - Document new integrations or tools clearly.
        - Test thoroughly before submitting a PR.
        - Update relevant documentation with your changes.

        ## Support and Queries

        For support or further inquiries, reach out to [ben@bengine.ai](mailto:ben@bengine.ai).

        Thank you for contributing to \`bengine-${extensionName}\`!
        `;
        await fs.writeFile(path.join(baseDir, 'README.md'), readmeContent);

        // Create module and service directories
        const modulesDir = path.join(baseDir, 'modules', extensionName);
        fs.mkdirSync(modulesDir, { recursive: true });
        fs.mkdirSync(path.join(modulesDir, 'views'), { recursive: true });

        const servicesDir = path.join(baseDir, 'services', extensionName);
        fs.mkdirSync(servicesDir, { recursive: true });

        // Create module files
        const moduleIndexJs = `const router = require('express').Router();

        router.get('/', async (req, res) => {
            res.render('${extensionName}/views/index', {
                title: '${extensionName}'
            });
        });

        module.exports = router;
        `;
        fs.writeFileSync(path.join(modulesDir, 'index.js'), moduleIndexJs);

        const indexPug = `extends ../../../common/_layout

        block content
            .container-fluid
                h1 ${extensionName}
        `;
        fs.writeFileSync(path.join(modulesDir, 'views', 'index.pug'), indexPug);

        // Create service files
        const appJs = `const express = require('express');
        const bodyParser = require("body-parser");
        const app = express();
        const port = 3001;

        app.use(bodyParser.json());

        app.get('/status', (req, res) => {
            res.status(200).send({
                status: 'OK',
                message: '${extensionName} API is running'
            })
        });

        app.listen(port, () => {
            console.log(\`${extensionName} API listening at http://localhost:\${port}\`);
        });
        `;
        fs.writeFileSync(path.join(servicesDir, 'app.js'), appJs);

        // Initialize npm and install dependencies
        await execAsync(`cd ${servicesDir} && npm init -y && npm i --save express body-parser`);

        // Create .gitignore
        await fs.writeFile(path.join(baseDir, '.gitignore'), 'node_modules/');

        console.log(`Extension scaffold for '${extensionName}' is complete.`);
    } catch (error) {
        console.error('Error in createExtension:', error.message);
        throw error;
    }
};
