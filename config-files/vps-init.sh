#!/bin/bash
set -e

# Make sure that terminal session is not open as root user

# Update package lists
echo "Updating the APT Repository..."
apt update 
apt install -y git nginx

# change nvm location 
if [ "$(logname)" != "root" ]; then
    export HOME=/home/$(logname)
fi

echo "[FIRST] current HOME location is $HOME"

# Install NVM (Node Version Manager)
echo "Installing NVM (Node Version Manager) ..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Install Node.js and npm using NVM
# source $HOME/.bashrc

if [ "$(logname)" != "0" ]; then
    export HOME=/home/$(logname)
fi

echo "[SECOND] current HOME location is $HOME"

chown -R $(logname):$(logname) .nvm .nvm/**/* 

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm install --lts

# Clone your repository
echo "Cloning Backend Github Repository..."
git clone https://github.com/SamarthBagga/carpool-backend
cd carpool-backend

echo "Installing Dependencies..."
npm install
npm install -g pm2

chown -R $(logname):$(logname) . node_modules node_modules/**/* 

# Copy Nginx configuration files
cp config-files/nginx/carpool-backend.conf /etc/nginx/sites-available/carpool-backend.conf

# Enable Nginx configuration
sed -i '/http {/a \ \ \ limit_req_zone $binary_remote_addr zone=carpool_limit:10m rate=20r/s;' /etc/nginx/nginx.conf
ln -s /etc/nginx/sites-available/carpool-backend.conf /etc/nginx/sites-enabled/carpool-backend.conf 
nginx -t && service nginx restart

chown -R $(logname):$(logname) $HOME/.nvm/**/*

