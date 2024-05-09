#!/bin/bash

# Update package lists
echo "Updating the APT Repository..."
sudo apt update 

# Install curl if not installed
echo "Installing curl..."
sudo apt install -y curl

# Install Node.js and npm using NVM (Node Version Manager)
echo "Installing NVM (Node Version Manager) ..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Clone your repository
echo "Cloning Backend Github Repository..."
git clone https://github.com/SamarthBagga/carpool-backend
cd carpool-backend

echo "Installing Dependencies..."
npm install
npm install -g pm2

echo "Starting Backend Server..."
npm run prod-server

echo "Deployment completed successfully!"

# Copy Nginx configuration files
sudo cp config-files/carpool-backend.conf /etc/nginx/sites-available/carpool-backend.conf

# Enable Nginx configuration
sudo ln -s /etc/nginx/sites-available/carpool-backend.conf /etc/nginx/sites-enabled/carpool-backend.conf 
sudo nginx -t && sudo systemctl restart nginx

