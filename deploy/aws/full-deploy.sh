#!/bin/bash
echo "🚀 DÉPLOIEMENT COMPLET AWS KAMINA OS"
echo "===================================="

set -e

echo "1. 🔧 Configuration AWS..."
chmod +x deploy/aws/setup-aws.sh
./deploy/aws/setup-aws.sh

echo "2. 🐳 Construction Docker..."
chmod +x deploy/aws/build-docker.sh  
./deploy/aws/build-docker.sh

echo "3. 🚀 Déploiement ECS..."
chmod +x deploy/aws/deploy-ecs.sh
./deploy/aws/deploy-ecs.sh

echo "🎉 🎉 🎉 DÉPLOIEMENT AWS TERMINÉ!"
echo ""
echo "📊 MONITORING:"
echo "   AWS Console: https://us-east-1.console.aws.amazon.com"
echo "   ECS Cluster: kamina-cluster"
echo "   ECR Repo: kamina-os"
echo ""
echo "🔧 PROCHAINES ÉTAPES:"
echo "   - Configurer le Load Balancer"
echo "   - Setup DNS (Route53)"
echo "   - Monitoring CloudWatch"
echo "   - Scaling automatique"
