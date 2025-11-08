FROM node:18-alpine

WORKDIR /app

# Installation des dépendances système
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Copier les fichiers de configuration
COPY package*.json ./
COPY tsconfig.json ./

# Installation des dépendances Node.js
RUN npm ci --only=production --ignore-scripts

# Copier le code source
COPY dist/ ./dist/
COPY src/ ./src/

# Créer l'utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Changer les permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

# Exposer le port
EXPOSE 8080

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=8080

# Santé check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Démarrer l'application
CMD ["node", "dist/api-gateway/server.js"]
