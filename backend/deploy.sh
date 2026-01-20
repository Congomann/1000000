#!/bin/bash

# Simple Deployment Script for NHFG Backend

echo "Deploying NHFG CRM Backend..."

# 1. Pull latest changes (if using git)
# git pull origin main

# 2. Install Dependencies
echo "Installing dependencies..."
npm install

# 3. Build TypeScript
echo "Building..."
npm run build

# 4. Run Migrations
echo "Running database migrations..."
npx prisma migrate deploy

# 5. Restart Application (using pm2 if available, or just node)
echo "Restarting application..."
# pm2 restart nhfg-backend || pm2 start dist/index.js --name nhfg-backend
echo "Application deployed! (Ensure you have a process manager like PM2 running)"
