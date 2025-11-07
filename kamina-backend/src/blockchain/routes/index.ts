// src/blockchain/routes/index.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { blockchainService } from '../services/blockchain.service';
import { ApiResponse } from '../../types';

export async function kaminaRoutes(fastify: FastifyInstance) {
  // Route pour obtenir le solde d'une adresse
  fastify.get('/balance/:address', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { address } = request.params as any;
      
      const balance = await blockchainService.getBalance(address);
      
      const response: ApiResponse<any> = {
        success: true,
        data: { address, balance },
        message: 'Balance retrieved successfully',
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

  // Route pour effectuer un transfert
  fastify.post('/transfer', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { to, amount } = request.body as any;
      
      const transaction = await blockchainService.transfer(to, amount);
      
      const response: ApiResponse<any> = {
        success: true,
        data: transaction,
        message: 'Transfer initiated successfully',
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

  // Route pour obtenir les détails d'une transaction
  fastify.get('/transaction/:hash', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { hash } = request.params as any;
      
      const transaction = await blockchainService.getTransaction(hash);
      
      if (!transaction) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Transaction not found',
        };
        return reply.status(404).send(response);
      }

      const response: ApiResponse<any> = {
        success: true,
        data: transaction,
        message: 'Transaction retrieved successfully',
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

  // Route pour obtenir les statistiques de la blockchain
  fastify.get('/stats', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const [blockNumber, gasPrice, walletAddress] = await Promise.all([
        blockchainService.getBlockNumber(),
        blockchainService.getGasPrice(),
        blockchainService.getWalletAddress(),
      ]);
      
      const stats = {
        blockNumber,
        gasPrice: `${gasPrice} Gwei`,
        walletAddress,
        network: process.env.BLOCKCHAIN_NETWORK || 'local',
        timestamp: new Date().toISOString(),
      };

      const response: ApiResponse<any> = {
        success: true,
        data: stats,
        message: 'Blockchain stats retrieved successfully',
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

  // Route pour obtenir l'adresse du wallet principal
  fastify.get('/wallet/address', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const address = await blockchainService.getWalletAddress();
      
      const response: ApiResponse<any> = {
        success: true,
        data: { address },
        message: 'Wallet address retrieved successfully',
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
}
