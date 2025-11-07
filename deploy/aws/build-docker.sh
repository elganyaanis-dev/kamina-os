#!/bin/bash
echo "🐳 CONSTRUCTION IMAGE DOCKER KAMINA OS"
echo "======================================"

cd kamina-backend

# Build l'image
docker build -t kamina-os:latest .

# Tester l'image localement
echo "🧪 Test local de l'image..."
docker run -d -p 8080:8080 --name kamina-test kamina-os:latest

sleep 10

# Vérifier que ça fonctionne
if curl -s http://localhost:8080/health > /dev/null; then
    echo "✅ Image Docker fonctionnelle"
else
    echo "❌ Erreur avec l'image Docker"
    exit 1
fi

# Nettoyer
docker stop kamina-test
docker rm kamina-test

echo "🎉 Image Docker prête pour AWS ECR!"
