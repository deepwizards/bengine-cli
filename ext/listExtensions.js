const fs = require('fs');
const path = require('path');

function parseBenfoJson(directory) {
    let extensionsInfo = [];
    if (fs.existsSync(directory)) {
        const dirs = fs.readdirSync(directory, { withFileTypes: true })
                        .filter(dirent => dirent.isDirectory())
                        .map(dirent => dirent.name);

        dirs.forEach(dir => {
            const benfoPath = path.join(directory, dir, 'benfo.json');
            if (fs.existsSync(benfoPath)) {
                const benfo = JSON.parse(fs.readFileSync(benfoPath, 'utf8'));
                extensionsInfo.push({ name: dir, info: benfo });
            }
        });
    }
    return extensionsInfo;
}

module.exports = function listExtensions() {
    console.log("List all extensions and their information...");

    try {
        const extensionsDir = path.join(process.cwd(), 'extensions');
        const modulesDir = path.join(process.cwd(), 'main', 'modules');
        const servicesDir = path.join(process.cwd(), 'services');

        const extensions = parseBenfoJson(extensionsDir);
        const modules = parseBenfoJson(modulesDir);
        const services = parseBenfoJson(servicesDir);

        console.log("Extensions:");
        console.log(JSON.stringify(extensions, null, 2));

        console.log("Modules:");
        console.log(JSON.stringify(modules, null, 2));

        console.log("Services:");
        console.log(JSON.stringify(services, null, 2));

        console.log("listExtensions complete.");

    } catch (error) {
        console.error("Failed to list extensions:", error);
    }
};
