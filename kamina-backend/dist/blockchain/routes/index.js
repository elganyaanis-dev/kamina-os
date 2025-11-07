"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kaminaRoutes = kaminaRoutes;
const blockchain_service_1 = require("../services/blockchain.service");
const tokenomics_1 = require("./tokenomics");
async function kaminaRoutes(fastify) {
    fastify.register(tokenomics_1.tokenomicsRoutes);
    fastify.get('/balance/:address', async (request, reply) => {
        try {
            const { address } = request.params;
            const balance = await blockchain_service_1.blockchainService.getBalance(address);
            const response = {
                success: true,
                data: { address, balance },
                message: 'Balance retrieved successfully',
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
    fastify.post('/transfer', async (request, reply) => {
        try {
            const { to, amount } = request.body;
            const transaction = await blockchain_service_1.blockchainService.transfer(to, amount);
            const response = {
                success: true,
                data: transaction,
                message: 'Transfer initiated successfully',
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
    fastify.get('/transaction/:hash', async (request, reply) => {
        try {
            const { hash } = request.params;
            const transaction = await blockchain_service_1.blockchainService.getTransaction(hash);
            if (!transaction) {
                const response = {
                    success: false,
                    error: 'Transaction not found',
                };
                return reply.status(404).send(response);
            }
            const response = {
                success: true,
                data: transaction,
                message: 'Transaction retrieved successfully',
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
    fastify.get('/stats', async (request, reply) => {
        try {
            const [blockNumber, gasPrice, walletAddress] = await Promise.all([
                blockchain_service_1.blockchainService.getBlockNumber(),
                blockchain_service_1.blockchainService.getGasPrice(),
                blockchain_service_1.blockchainService.getWalletAddress(),
            ]);
            const stats = {
                blockNumber,
                gasPrice: `${gasPrice} Gwei`,
                walletAddress,
                network: process.env.BLOCKCHAIN_NETWORK || 'local',
                timestamp: new Date().toISOString(),
            };
            const response = {
                success: true,
                data: stats,
                message: 'Blockchain stats retrieved successfully',
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
    fastify.get('/wallet/address', async (request, reply) => {
        try {
            const address = await blockchain_service_1.blockchainService.getWalletAddress();
            const response = {
                success: true,
                data: { address },
                message: 'Wallet address retrieved successfully',
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
}
//# sourceMappingURL=index.js.map