# 🚀 Kamina OS - Guide de Déploiement

## Architecture Déployée
- **Backend API**: Fastify + TypeScript (Port 8080)
- **Mobile**: React Native + Expo
- **Dashboard**: Next.js (Port 3000)
- **Blockchain**: Substrate Rust

## Pré-requis
- Node.js >= 20.0.0
- Rust >= 1.70.0
- PostgreSQL (pour la production)
- Redis (pour le cache)

## Déploiement Backend

### Développement
```bash
cd kamina-backend
npm install
npm run dev
cd kamina-backend
npm run build
npm start
NODE_ENV=production
JWT_SECRET=your-super-secret-key
BLOCKCHAIN_RPC_URL=http://localhost:8545
DATABASE_URL=postgresql://user:pass@localhost:5432/kamina
REDIS_URL=redis://localhost:6379
cd kamina-dashboard
npm install
npm run dev
cd kamina-dashboard
npm run build
npm start
cd kamina-mobile
npm install
npm start
npm run build:android
npm run build:ios
cd kamina-backend
npm test
npm run lint

## **Étape 7.2 - Création des scripts de test**

Créons des tests simples pour le backend :

```bash
mkdir -p kamina-backend/tests
cat > kamina-backend/tests/auth.test.ts << 'EOF'
// kamina-backend/tests/auth.test.ts
import { describe, it, expect, beforeEach } from '@jest/globals';
import { webAuthnService } from '../src/auth/services/webauthn.service';
import { jwtService } from '../src/auth/services/jwt.service';

describe('Authentication System', () => {
  beforeEach(() => {
    // Reset state before each test
  });

  describe('WebAuthn Service', () => {
    it('should generate registration options', async () => {
      const user = {
        id: 'test-user-123',
        walletAddress: '0x742d35e1',
        username: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const options = await webAuthnService.generateRegistrationOptions(user);
      
      expect(options).toHaveProperty('challenge');
      expect(options).toHaveProperty('rp');
      expect(options.rp.name).toBe('Kamina OS');
    });

    it('should generate authentication options', async () => {
      const walletAddress = '0x742d35e1';
      const options = await webAuthnService.generateAuthenticationOptions(walletAddress);
      
      expect(options).toHaveProperty('challenge');
      expect(options).toHaveProperty('rpId');
    });
  });

  describe('JWT Service', () => {
    it('should generate valid tokens', () => {
      const user = {
        id: 'test-user-123',
        walletAddress: '0x742d35e1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const accessToken = jwtService.generateAccessToken(user);
      const refreshToken = jwtService.generateRefreshToken(user);
      
      expect(typeof accessToken).toBe('string');
      expect(typeof refreshToken).toBe('string');
      expect(accessToken.length).toBeGreaterThan(0);
      expect(refreshToken.length).toBeGreaterThan(0);
    });

    it('should verify valid tokens', () => {
      const user = {
        id: 'test-user-123',
        walletAddress: '0x742d35e1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const token = jwtService.generateAccessToken(user);
      const payload = jwtService.verifyToken(token);
      
      expect(payload.sub).toBe(user.id);
      expect(payload.walletAddress).toBe(user.walletAddress);
    });
  });
});
