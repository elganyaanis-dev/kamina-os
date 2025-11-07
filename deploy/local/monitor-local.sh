#!/bin/bash
# deploy/local/monitor-local.sh - Local Monitoring

echo "📊 KAMINA OS - LOCAL MONITORING"
echo "================================"

while true; do
    clear
    echo "$(date) - Kamina OS Status"
    echo "================================"
    
    # Check if server is running
    if curl -s http://localhost:8080/health > /dev/null; then
        echo "✅ Server: RUNNING"
        echo "🌐 Endpoints:"
        echo "   - http://localhost:8080/health"
        echo "   - http://localhost:8080/api/v1/ai/chat" 
        echo "   - http://localhost:8080/api/v1/kamina/stats"
    else
        echo "❌ Server: STOPPED"
        echo "💡 Run: ./deploy/local/deploy-local.sh"
    fi
    
    echo ""
    echo "Press Ctrl+C to exit monitoring"
    sleep 5
done
