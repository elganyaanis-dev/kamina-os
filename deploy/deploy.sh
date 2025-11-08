#!/bin/bash
# deploy/deploy.sh - Automated deployment script

set -e

echo "🚀 Starting Kamina OS Deployment..."

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
fi

# Build Docker images
echo "📦 Building Docker images..."
docker-compose -f docker-compose.production.yml build

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose -f docker-compose.production.yml run --rm kamina-backend \
    npx tsx src/database/migrate.ts

# Deploy services
echo "☁️ Deploying services..."
docker-compose -f docker-compose.production.yml up -d

# Health check
echo "🏥 Performing health check..."
sleep 30
curl -f http://localhost:8080/health || exit 1

echo "✅ Deployment completed successfully!"
echo "🌐 Backend API: http://localhost:8080"
echo "📊 Health check: http://localhost:8080/health"
