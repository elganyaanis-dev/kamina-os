#!/bin/bash
# deploy/local/deploy-local.sh - Local Deployment Test

set -e

echo "🚀 KAMINA OS - LOCAL DEPLOYMENT TEST"
echo "======================================"

cd kamina-backend

# Install dependencies if needed
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the application
echo "🏗 Building application..."
npm run build

# Start the server in background
echo "🌐 Starting Kamina OS server..."
npm run dev &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 8

# Test all API endpoints
echo "🧪 TESTING ALL SERVICES:"
echo ""

echo "1. 🏥 Health Check:"
curl -s http://localhost:8080/health | jq '.' 2>/dev/null || echo "   ❌ Health check failed"

echo ""
echo "2. 🤖 AI Service:"
curl -s http://localhost:8080/api/v1/ai/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"prompt":"What can you do?"}' | jq '.' 2>/dev/null || echo "   ❌ AI service failed"

echo ""
echo "3. ⛓ Blockchain API:"
curl -s http://localhost:8080/api/v1/kamina/stats | jq '.' 2>/dev/null || echo "   ❌ Blockchain API failed"

echo ""
echo "4. 💰 Tokenomics API:"
curl -s http://localhost:8080/api/v1/kamina/tokenomics | jq '.' 2>/dev/null || echo "   ❌ Tokenomics API failed"

echo ""
echo "5. 🔐 Auth Service:"
curl -s http://localhost:8080/api/v1/auth/verify \
  -H "Authorization: Bearer test" | jq '.' 2>/dev/null || echo "   ❌ Auth service failed"

echo ""
echo "🎉 LOCAL DEPLOYMENT TEST COMPLETED!"
echo ""
echo "🌐 YOUR KAMINA OS IS RUNNING!"
echo "   API: http://localhost:8080"
echo "   Health: http://localhost:8080/health"
echo "   AI: http://localhost:8080/api/v1/ai/chat"
echo ""
echo "🛑 To stop the server: kill $SERVER_PID"
echo "📊 To monitor: tail -f kamina-backend/logs/server.log"

# Keep server running
echo ""
echo "Server will continue running. Press Ctrl+C to stop."
wait $SERVER_PID
