#!/bin/bash
# deploy/monitor.sh - Monitoring script

echo "📊 Kamina OS Monitoring Dashboard"
echo "=================================="

while true; do
    clear
    
    # Backend health
    echo "🔧 Backend Services:"
    curl -s http://localhost:8080/health | jq '.' 2>/dev/null || echo "Backend unavailable"
    
    # AI Service health
    echo ""
    echo "🤖 AI Service:"
    curl -s http://localhost:8080/api/v1/ai/health | jq '.' 2>/dev/null || echo "AI service unavailable"
    
    # System resources
    echo ""
    echo "💾 System Resources:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" kamina-backend postgres redis 2>/dev/null || echo "Docker not available"
    
    sleep 10
done
