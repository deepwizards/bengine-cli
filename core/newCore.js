const { execSync } = require('child_process');
const readlineSync = require('readline-sync'); // Ensure this dependency is installed
const fs = require('fs');
const path = require('path');

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
        let dbConnection = readlineSync.question('Enter DB connection string or leave blank to use default containerized DB: ');
        if (!dbConnection) {
            // Logic to run a containerized DB
            console.log("Setting up a default containerized database...");
            execSync('docker-compose up -d database', { stdio: 'inherit' });
            dbConnection = 'default DB connection string';
        }
        // Set DB URI in environment
        process.env.BENGINE_DB_URI = dbConnection;
        // Implement logic to test DB connection here

        console.log("Seeding the database...");
        // Determine which seeding script to run
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
            // Nginx configuration
            const nginxConfig = `
                server {
                    listen 80;
                    server_name ${domainName};

                    location / {
                        proxy_pass http://localhost:YOUR_APP_PORT; # Replace with your app's port
                        proxy_http_version 1.1;
                        proxy_set_header Upgrade \$http_upgrade;
                        proxy_set_header Connection 'upgrade';
                        proxy_set_header Host \$host;
                        proxy_cache_bypass \$http_upgrade;
                    }
                }
            `;

            // Write Nginx config file
            fs.writeFileSync(`/etc/nginx/sites-available/${domainName}`, nginxConfig);
            execSync(`ln -s /etc/nginx/sites-available/${domainName} /etc/nginx/sites-enabled/`);

            // Reload Nginx to apply new config
            execSync('nginx -s reload');

            // LetsEncrypt SSL setup
            execSync(`certbot --nginx -d ${domainName} --non-interactive --agree-tos -m your-email@example.com`, { stdio: 'inherit' });

            console.log("Nginx and SSL setup complete.");
        }

        console.log("Installing npm packages...");
        execSync('npm install', { stdio: 'inherit' });

        // Building service cluster
        console.log("Building service cluster...");
        execSync('cd services && docker-compose build', { stdio: 'inherit' });


        console.log("Running post-install tests...");
        // Logic for post-install tests
        // Placeholder for now

        console.log("Bengine core installation complete.");

    } catch (error) {
        console.error("Failed to install Bengine:", error);
        console.log("Please check the errors above and try again.");
    }
};
