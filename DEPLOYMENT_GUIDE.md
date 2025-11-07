# 🚀 Kamina OS - Deployment Guide

## Quick Start
```bash
# Deploy to free EC2 instance
./deploy/aws/deploy-ec2.sh

# Monitor deployment
./deploy/aws/monitor.sh

**Maintenant vérifions :**

```bash
find deploy/aws/ -type f -name "*.sh" | sort
ls -la DEPLOYMENT_GUIDE.md
find deploy/aws/ -type f -name "*.sh" | sort
ls -la DEPLOYMENT_GUIDE.md
pwd
: /data/data/com.termux/files/home/kamina-os
cat > deploy/aws/setup.sh << 'EOF'
#!/bin/bash
echo "🛠 AWS Setup - Run this after configuring AWS CLI"
echo "Use: aws configure to set up credentials first"
