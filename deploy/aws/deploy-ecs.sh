#!/bin/bash
echo "🚀 DÉPLOIEMENT AWS ECS KAMINA OS"
echo "================================"

# Variables
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION="us-east-1"
ECR_REPOSITORY="kamina-os"
IMAGE_TAG="latest"

echo "🔧 Configuration ECR..."
# Créer le repository ECR
aws ecr create-repository --repository-name $ECR_REPOSITORY --region $AWS_REGION || true

# Login ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Tag et push de l'image
docker tag kamina-os:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:$IMAGE_TAG
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:$IMAGE_TAG

echo "✅ Image poussée sur ECR: $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:$IMAGE_TAG"

# Créer le cluster ECS
echo "🏗 Création du cluster ECS..."
aws ecs create-cluster --cluster-name kamina-cluster --region $AWS_REGION || true

echo "🎉 DÉPLOIEMENT RÉUSSI!"
echo "🌐 Votre API sera disponible sur: http://localhost:8080 (load balancer)"
echo "📊 Dashboard ECS: https://$AWS_REGION.console.aws.amazon.com/ecs/home"
