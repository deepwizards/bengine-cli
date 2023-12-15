const { execSync } = require('child_process');
const readlineSync = require('readline-sync');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const yaml = require('js-yaml');

function isPortInUse(port) {
    try {
        // Using lsof to check if MongoDB is listening on the specified port
        const command = `lsof -i tcp:${port} | grep LISTEN | grep mongod`;
        const result = execSync(command).toString().trim();
        return result !== '';
    } catch (error) {
        return false;
    }
}

async function checkExistingMongoDB() {
    const inUse = await isPortInUse(27017);
    return inUse && readlineSync.keyInYN('An existing MongoDB server is detected. Would you like to use it?');
}

function checkExistingDockerContainer() {
    try {
        const result = execSync('docker ps -q --filter ancestor=mongo').toString().trim();
        if (result !== '') {
            return true;
        } else {
            return false;
        }
    } catch {
        return false;
    }
}

async function setupDatabaseConnection() {
    const dbConnection = await determineDbConnection();
    if (!dbConnection) {
        console.error('No valid MongoDB connection could be established.');
        process.exit(1);
    }

    try {
        await mongoose.connect(dbConnection);
        await mongoose.connection.readyState;
        console.log('Database connection established successfully.');

        const envFilePath = path.join(process.cwd(), '/.env');
        fs.writeFileSync(envFilePath, `BENGINE_DB_URI=${dbConnection}\n`, { flag: 'w' });
        console.log('Database connection string added to .env file.');
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    }
}

async function determineDbConnection() {
    if (await checkExistingMongoDB()) {
        const localIpAddress = readlineSync.question('Enter your local IP address: ');
        return `mongodb://${localIpAddress}:27017/__bengine`;
    } else if (await checkExistingDockerContainer()) {
        addMongoToDockerCompose();
        return 'mongodb://bengine-mongo:27017/__bengine';
    }

    if (readlineSync.keyInYN('Set up a new MongoDB container?')) {
        addMongoToDockerCompose();
        return 'mongodb://bengine-mongo:27017/__bengine';
    }

    return readlineSync.question('Enter MongoDB connection string: ');
}

function addMongoToDockerCompose() {
    const dockerComposePath = path.join(process.cwd(), '/main/docker-compose.yml');
    let dockerCompose = yaml.load(fs.readFileSync(dockerComposePath, 'utf8'));

    dockerCompose.services = dockerCompose.services || {};
    dockerCompose.services['bengine-mongo'] = {
        image: 'mongo',
        ports: ['27017:27017']
    };

    fs.writeFileSync(dockerComposePath, yaml.dump(dockerCompose), 'utf8');
    console.log('Added bengine-mongo service to docker-compose.yml.');
}


function buildDockerClusters() {
    execSync('docker-compose -f main/docker-compose.yml build', { stdio: 'inherit' });
    execSync('docker-compose -f services/docker-compose.yml build', { stdio: 'inherit' });
}

function cloneRepository() {
    if (fs.existsSync('./bengine')) {
        console.log("Existing Bengine project found. Cancelling installation.");
        process.exit(1);
    } else {
        execSync('git clone https://github.com/deepwizards/bengine.git', { stdio: 'inherit' });
        process.chdir('./bengine');
        console.log(process.cwd());
        console.log("Repository cloned successfully.");
    }
}

function installDependencies() {
    console.log("Installing dependencies...");
    const mainDirPath = process.cwd() + '/main';
    execSync(`npm install --prefix "${mainDirPath}"`, { stdio: 'inherit' });
    console.log("Dependencies installed successfully.");
}

async function main() {
    try {
        await cloneRepository();
        await installDependencies();
        await setupDatabaseConnection();
        await buildDockerClusters();
        console.log("Bengine core installation complete.");
        process.exit(0);
    } catch (error) {
        console.error("Failed to install Bengine:", error);
        process.exit(1);
    }
}

module.exports = main;
