"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const webauthn_service_1 = require("../services/webauthn.service");
const jwt_service_1 = require("../services/jwt.service");
async function authRoutes(fastify) {
    fastify.post('/register/start', async (request, reply) => {
        try {
            const { walletAddress, username } = request.body;
            const user = {
                id: Math.random().toString(36).substr(2, 9),
                walletAddress,
                username,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const options = await webauthn_service_1.webAuthnService.generateRegistrationOptions(user);
            const response = {
                success: true,
                data: options,
                message: 'Registration options generated successfully',
            };
            reply.send(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
            reply.status(400).send(response);
        }
    });
    fastify.post('/register/finish', async (request, reply) => {
        try {
            const { credential, user } = request.body;
            const verification = await webauthn_service_1.webAuthnService.verifyRegistration(credential, user);
            if (verification.verified) {
                const accessToken = jwt_service_1.jwtService.generateAccessToken(user);
                const refreshToken = jwt_service_1.jwtService.generateRefreshToken(user);
                const response = {
                    success: true,
                    data: {
                        user,
                        accessToken,
                        refreshToken,
                    },
                    message: 'Registration completed successfully',
                };
                reply.send(response);
            }
            else {
                throw new Error('Registration verification failed');
            }
        }
        catch (error) {
            const response = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
            reply.status(400).send(response);
        }
    });
    fastify.post('/login/start', async (request, reply) => {
        try {
            const { walletAddress } = request.body;
            const options = await webauthn_service_1.webAuthnService.generateAuthenticationOptions(walletAddress);
            const response = {
                success: true,
                data: options,
                message: 'Authentication options generated successfully',
            };
            reply.send(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
            reply.status(400).send(response);
        }
    });
    fastify.post('/login/finish', async (request, reply) => {
        try {
            const { credential, walletAddress } = request.body;
            const verification = await webauthn_service_1.webAuthnService.verifyAuthentication(credential, walletAddress);
            if (verification.verified) {
                const user = {
                    id: Math.random().toString(36).substr(2, 9),
                    walletAddress,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                const accessToken = jwt_service_1.jwtService.generateAccessToken(user);
                const refreshToken = jwt_service_1.jwtService.generateRefreshToken(user);
                const response = {
                    success: true,
                    data: {
                        user,
                        accessToken,
                        refreshToken,
                    },
                    message: 'Login successful',
                };
                reply.send(response);
            }
            else {
                throw new Error('Authentication verification failed');
            }
        }
        catch (error) {
            const response = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
            reply.status(400).send(response);
        }
    });
    fastify.post('/refresh', async (request, reply) => {
        try {
            const { refreshToken } = request.body;
            const accessToken = jwt_service_1.jwtService.refreshAccessToken(refreshToken);
            const response = {
                success: true,
                data: { accessToken },
                message: 'Token refreshed successfully',
            };
            reply.send(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
            reply.status(401).send(response);
        }
    });
    fastify.get('/verify', async (request, reply) => {
        try {
            const authHeader = request.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new Error('No token provided');
            }
            const token = authHeader.substring(7);
            const payload = jwt_service_1.jwtService.verifyToken(token);
            const response = {
                success: true,
                data: { valid: true, payload },
                message: 'Token is valid',
            };
            reply.send(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
            reply.status(401).send(response);
        }
    });
}
//# sourceMappingURL=index.js.map