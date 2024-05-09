#!/bin/bash
set -e

# Make sure that terminal session is not open as root user

# Update package lists
echo "Updating the APT Repository..."
apt update 
apt install -y git nginx

# Install NVM (Node Version Manager)
echo "Installing NVM (Node Version Manager) ..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Install Node.js and npm using NVM
# source $HOME/.bashrc
exec bash
nvm install --lts
exec bash
# source $HOME/.bashrc

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
sed -i '/http {/a \ \ # Additional configuration lines here' /etc/nginx/nginx.conf
ln -s /etc/nginx/sites-available/carpool-backend.conf /etc/nginx/sites-enabled/carpool-backend.conf 
nginx -t && systemctl restart nginx

echo "Starting Backend Server..."
npm run prod-server

echo "Deployment completed successfully!"

