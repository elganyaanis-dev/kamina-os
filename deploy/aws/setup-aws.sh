#!/bin/bash
echo "🌐 CONFIGURATION AWS KAMINA OS"
echo "==============================="

# Vérifications préalables
if ! command -v aws &> /dev/null; then
    echo "📦 Installation AWS CLI..."
    curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
fi

# Configuration
AWS_REGION="us-east-1"
ECR_REPOSITORY="kamina-os"
CLUSTER_NAME="kamina-cluster"

echo "✅ AWS CLI configuré"
echo "🌍 Région: $AWS_REGION"
echo "🐳 ECR: $ECR_REPOSITORY"
echo "🏗 Cluster: $CLUSTER_NAME"

# Vérifier la configuration
aws configure list
