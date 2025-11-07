// src/api-gateway/server.ts
import Fastify from 'fastify';
import fastifyWebSocket from '@fastify/websocket';
import fastifyCors from '@fastify/cors';
import { authRoutes } from '../auth/routes';
import { kaminaRoutes } from '../blockchain/routes';

const fastify = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  },
  trustProxy: true,
  connectionTimeout: 30000,
});

async function main() {
  // Plugins
  await fastify.register(fastifyCors, {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  await fastify.register(fastifyWebSocket, {
    options: {
      maxPayload: 1048576, // 1MB
    },
  });

  // Health check
  fastify.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        blockchain: 'connected',
        database: 'connected',
        cache: 'connected',
      },
    };
  });

  // Routes
  fastify.register(authRoutes, { prefix: '/api/v1/auth' });
  fastify.register(kaminaRoutes, { prefix: '/api/v1/kamina' });

  // 404 handler
  fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      error: 'Not Found',
      message: `Route ${request.method}:${request.url} not found`,
    });
  });

  // Error handler
  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);
    reply.status(error.statusCode || 500).send({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message,
    });
  });

  // Start server
  try {
    await fastify.listen({ port: 8080, host: '0.0.0.0' });
    console.log('🚀 Kamina API Gateway running on port 8080');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main().catch(console.error);

export default fastify;
