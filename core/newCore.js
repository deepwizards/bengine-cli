const { execSync } = require('child_process');
const readlineSync = require('readline-sync'); // Ensure this dependency is installed
const fs = require('fs');
const mongoose = require('mongoose');

module.exports = function cloneCore() {
    try {
        console.log("Cloning Bengine core repository...");
        execSync('git clone https://github.com/deepwizards/bengine.git', { stdio: 'inherit' });
        process.chdir('./bengine');
        console.log("Repository cloned successfully.");

        console.log("Setting up the environment...");

        // Admin account credentials setup
        const adminUsername = readlineSync.question('Enter admin username: ');
        const adminPassword = readlineSync.questionNewPassword('Enter admin password: ', { min: 8, max: 20 });

        // DB connection setup
        let dbConnection = readlineSync.question('Enter DB connection string or leave blank to use the official MongoDB container: ');
        if (!dbConnection) {
            console.log("Setting up the official MongoDB container...");
            execSync('docker run --name mongodb -d mongo', { stdio: 'inherit' });
            dbConnection = 'mongodb://localhost:27017/bengine';
        }
        process.env.BENGINE_DB_URI = dbConnection;

        mongoose.connect(process.env.BENGINE_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                console.log('Database connection successful');
            })
            .catch(err => {
                console.error('Database connection error:', err);
            });

        console.log("Seeding the database...");
        if (readlineSync.keyInYN('Do you want to install the default demo project?')) {
            execSync(`node main/seed/new_full.js ${adminUsername} ${adminPassword}`, { stdio: 'inherit' });
        } else {
            execSync('node main/seed/new_bare.js', { stdio: 'inherit' });
        }

        // Domain name setup
        const domainName = readlineSync.question('Enter your domain name or leave blank for localhost: ');
        if (domainName) {
            // Logic for domain setup
            // Update domain configuration in application settings
        }

        // Nginx / LetsEncrypt SSL setup
        if (domainName && readlineSync.keyInYN('Do you want to set up Nginx and LetsEncrypt for SSL?')) {
            console.log("Setting up Nginx and LetsEncrypt SSL...");
            const nginxConfig = `
                server {
                    listen 80;
                    server_name ${domainName};

                    location / {
                        proxy_pass http://localhost:1337;
                        proxy_http_version 1.1;
                        proxy_set_header Upgrade \$http_upgrade;
                        proxy_set_header Connection 'upgrade';
                        proxy_set_header Host \$host;
                        proxy_cache_bypass \$http_upgrade;
                    }
                }
            `;

            fs.writeFileSync(`/etc/nginx/sites-available/${domainName}`, nginxConfig);
            execSync(`ln -s /etc/nginx/sites-available/${domainName} /etc/nginx/sites-enabled/`);
            execSync('nginx -s reload');
            execSync(`certbot --nginx -d ${domainName} --non-interactive --agree-tos -m your-email@example.com`, { stdio: 'inherit' });
            console.log("Nginx and SSL setup complete.");
        }

        // Building main application cluster
        console.log("Building main cluster...");
        execSync('cd main && docker-compose build', { stdio: 'inherit' });

        // Building service cluster
        console.log("Building service cluster...");
        execSync('cd .. && cd services && docker-compose build', { stdio: 'inherit' });


        console.log("Running post-install tests...");
        // Logic for post-install tests
        // Placeholder for now

        console.log("Bengine core installation complete.");

    } catch (error) {
        console.error("Failed to install Bengine:", error);
        console.log("Please check the errors above and try again.");
    }
};
