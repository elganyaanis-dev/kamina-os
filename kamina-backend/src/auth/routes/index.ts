// src/auth/routes/index.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { webAuthnService } from '../services/webauthn.service';
import { jwtService } from '../services/jwt.service';
import { User, ApiResponse } from '../../types';

export async function authRoutes(fastify: FastifyInstance) {
  // Route pour générer les options d'enregistrement WebAuthn
  fastify.post('/register/start', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { walletAddress, username } = request.body as any;
      
      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        walletAddress,
        username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const options = await webAuthnService.generateRegistrationOptions(user);
      
      const response: ApiResponse<any> = {
        success: true,
        data: options,
        message: 'Registration options generated successfully',
      };

      reply.send(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      reply.status(400).send(response);
    }
  });

  // Route pour finaliser l'enregistrement WebAuthn
  fastify.post('/register/finish', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { credential, user } = request.body as any;
      
      const verification = await webAuthnService.verifyRegistration(credential, user);
      
      if (verification.verified) {
        const accessToken = jwtService.generateAccessToken(user);
        const refreshToken = jwtService.generateRefreshToken(user);
        
        const response: ApiResponse<any> = {
          success: true,
          data: {
            user,
            accessToken,
            refreshToken,
          },
          message: 'Registration completed successfully',
        };

        reply.send(response);
      } else {
        throw new Error('Registration verification failed');
      }
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      reply.status(400).send(response);
    }
  });

  // Route pour démarrer l'authentification
  fastify.post('/login/start', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { walletAddress } = request.body as any;
      
      const options = await webAuthnService.generateAuthenticationOptions(walletAddress);
      
      const response: ApiResponse<any> = {
        success: true,
        data: options,
        message: 'Authentication options generated successfully',
      };

      reply.send(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      reply.status(400).send(response);
    }
  });

  // Route pour finaliser l'authentification
  fastify.post('/login/finish', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { credential, walletAddress } = request.body as any;
      
      const verification = await webAuthnService.verifyAuthentication(credential, walletAddress);
      
      if (verification.verified) {
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          walletAddress,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const accessToken = jwtService.generateAccessToken(user);
        const refreshToken = jwtService.generateRefreshToken(user);
        
        const response: ApiResponse<any> = {
          success: true,
          data: {
            user,
            accessToken,
            refreshToken,
          },
          message: 'Login successful',
        };

        reply.send(response);
      } else {
        throw new Error('Authentication verification failed');
      }
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      reply.status(400).send(response);
    }
  });

  // Route pour rafraîchir le token
  fastify.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { refreshToken } = request.body as any;
      
      const accessToken = jwtService.refreshAccessToken(refreshToken);
      
      const response: ApiResponse<any> = {
        success: true,
        data: { accessToken },
        message: 'Token refreshed successfully',
      };

      reply.send(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      reply.status(401).send(response);
    }
  });

  // Route pour vérifier le token
  fastify.get('/verify', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('No token provided');
      }

      const token = authHeader.substring(7);
      const payload = jwtService.verifyToken(token);
      
      const response: ApiResponse<any> = {
        success: true,
        data: { valid: true, payload },
        message: 'Token is valid',
      };

      reply.send(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      reply.status(401).send(response);
    }
  });
}
