

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