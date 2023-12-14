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

    process.env.BENGINE_DB_URI = dbConnection;

    try {
        await mongoose.connect(process.env.BENGINE_DB_URI);
        await mongoose.connection.readyState;
        console.log('Database connection established successfully.');

        const envFilePath = path.join(process.cwd(), '/main/.env');
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

// function setupAdminAccount() {
//     const adminUsername = readlineSync.question('Enter admin username: ');
//     const adminPassword = readlineSync.questionNewPassword('Enter admin password: ', { min: 8, max: 20 });
//     return { adminUsername, adminPassword };
// }

// async function seedDatabase(adminUsername, adminPassword) {
//     console.log('Seeding database...');
//     mongoose.connect(process.env.BENGINE_DB_URI);
//     await mongoose.connection.readyState;
//     console.log('Database connection established successfully.');
//     const User = require(process.cwd() + '/main/db/models/User');
//     console.log(User)
//     try {
//         const admin = new User({
//             username: adminUsername,
//             password: adminPassword,
//             role: 'admin',
//         });
//         console.log(admin)
//         await admin.save();

//         // Test to verify if the user was added correctly
//         const user = await User.findOne({ username: adminUsername });
//         if (!user) {
//             throw new Error('User not found after insertion');
//         }
//         console.log('Admin user seeded and verified successfully');
//     } catch (error) {
//         console.error('Error seeding admin user:', error);
//     }
// }

// function setupDomainAndSSL(domainName) {
//     if (domainName && readlineSync.keyInYN('Set up Nginx and LetsEncrypt for SSL?')) {
//         const nginxConfig = `
//             server {
//                 listen 80;
//                 server_name ${domainName};
//                 location / {
//                     proxy_pass http://localhost:1337;
//                     proxy_http_version 1.1;
//                     proxy_set_header Upgrade \$http_upgrade;
//                     proxy_set_header Connection 'upgrade';
//                     proxy_set_header Host \$host;
//                     proxy_cache_bypass \$http_upgrade;
//                 }
//             }
//         `;
//         fs.writeFileSync(`/etc/nginx/sites-available/${domainName}`, nginxConfig);
//         execSync(`ln -s /etc/nginx/sites-available/${domainName} /etc/nginx/sites-enabled/`);
//         execSync('nginx -s reload');
//         execSync(`certbot --nginx -d ${domainName} --non-interactive --agree-tos -m user@bengine.ai`, { stdio: 'inherit' });
//         console.log("Nginx and SSL setup complete.");
//     }
// }

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
        // const { adminUsername, adminPassword } = await setupAdminAccount();
        // await seedDatabase(adminUsername, adminPassword);
        // const domainName = readlineSync.question('Enter your domain name or leave blank for localhost: ');
        // await setupDomainAndSSL(domainName);
        await buildDockerClusters();
        console.log("Bengine core installation complete.");
        process.exit(0);
    } catch (error) {
        console.error("Failed to install Bengine:", error);
        process.exit(1);
    }
}

module.exports = main;
