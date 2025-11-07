#!/bin/bash
echo "🖥 Deploy to EC2 Free Tier"
echo "Deploys Kamina OS to free EC2 instance"
EOcat > deploy/aws/monitor.sh << 'EOF'
#!/bin/bash
echo "📊 Monitor AWS Deployment"
echo "Shows real-time metrics and status"
