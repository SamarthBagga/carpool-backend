#!/bin/bash
set -e

# Make sure that terminal session is not open as root user

# Update package lists
echo "Updating the APT Repository..."
apt update 
apt install -y git nginx

# change nvm location 
if [ "$(id -u)" != "0" ]; then
    export HOME=/home/$(logname)
fi

# Install NVM (Node Version Manager)
echo "Installing NVM (Node Version Manager) ..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Install Node.js and npm using NVM
source $HOME/.bashrc

if [ "$(id -u)" != "0" ]; then
    export HOME=/home/$(logname)
fi

nvm install --lts

# Clone your repository
echo "Cloning Backend Github Repository..."
git clone https://github.com/SamarthBagga/carpool-backend
cd carpool-backend

echo "Installing Dependencies..."
npm install
npm install -g pm2

# Copy Nginx configuration files
cp config-files/nginx/carpool-backend.conf /etc/nginx/sites-available/carpool-backend.conf

# Enable Nginx configuration
sed -i '/http {/a \ \ \ limit_req_zone $binary_remote_addr zone=carpool_limit:10m rate=20r/s;' /etc/nginx/nginx.conf
ln -s /etc/nginx/sites-available/carpool-backend.conf /etc/nginx/sites-enabled/carpool-backend.conf 
nginx -t && service nginx restart

echo "Starting Backend Server..."
npm run prod-server

echo "Deployment completed successfully!"

