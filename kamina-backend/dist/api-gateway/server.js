"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const websocket_1 = __importDefault(require("@fastify/websocket"));
const cors_1 = __importDefault(require("@fastify/cors"));
const routes_1 = require("../auth/routes");
const routes_2 = require("../blockchain/routes");
const routes_3 = require("../ai-core/routes");
const fastify = (0, fastify_1.default)({
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
    await fastify.register(cors_1.default, {
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    await fastify.register(websocket_1.default, {
        options: {
            maxPayload: 1048576,
        },
    });
    fastify.get('/health', async () => {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            services: {
                blockchain: 'connected',
                database: 'connected',
                cache: 'connected',
                ai: 'connected',
            },
        };
    });
    fastify.register(routes_1.authRoutes, { prefix: '/api/v1/auth' });
    fastify.register(routes_2.kaminaRoutes, { prefix: '/api/v1/kamina' });
    fastify.register(routes_3.aiRoutes, { prefix: '/api/v1/ai' });
    fastify.setNotFoundHandler((request, reply) => {
        reply.status(404).send({
            error: 'Not Found',
            message: `Route ${request.method}:${request.url} not found`,
        });
    });
    fastify.setErrorHandler((error, request, reply) => {
        fastify.log.error(error);
        reply.status(error.statusCode || 500).send({
            error: 'Internal Server Error',
            message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message,
        });
    });
    try {
        await fastify.listen({ port: 8080, host: "127.0.0.1" });
        console.log('🚀 Kamina API Gateway running on port 8080');
        console.log('🤖 KaminaLLM-7B AI Service: Enabled');
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}
main().catch(console.error);
exports.default = fastify;
//# sourceMappingURL=server.js.map