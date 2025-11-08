// src/blockchain/routes/tokenomics.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { tokenomicsService } from '../services/tokenomics.service';
import { ApiResponse } from '../../types';

export async function tokenomicsRoutes(fastify: FastifyInstance) {
  // Route pour obtenir les données tokenomics globales
  fastify.get('/tokenomics', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const tokenomicsData = await tokenomicsService.getTokenomicsData();
      
      const response: ApiResponse<any> = {
        success: true,
        data: tokenomicsData,
        message: 'Tokenomics data retrieved successfully',
      };

      reply.send(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      reply.status(500).send(response);
    }
  });

  // Route pour obtenir les infos de staking d'un utilisateur
  fastify.get('/staking/:address', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { address } = request.params as any;
      
      const stakingInfo = await tokenomicsService.getStakingInfo(address);
      
      const response: ApiResponse<any> = {
        success: true,
        data: stakingInfo,
        message: 'Staking info retrieved successfully',
      };

      reply.send(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      reply.status(500).send(response);
    }
  });

  // Route pour calculer les récompenses de staking
  fastify.post('/staking/calculate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { amount, duration } = request.body as any;
      
      const rewards = await tokenomicsService.calculateStakingRewards(amount, duration);
      
      const response: ApiResponse<any> = {
        success: true,
        data: { rewards },
        message: 'Staking rewards calculated successfully',
      };

      reply.send(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      reply.status(500).send(response);
    }
  });

  // Route pour obtenir le calendrier d'inflation
  fastify.get('/inflation-schedule', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const inflationSchedule = await tokenomicsService.getInflationSchedule();
      
      const response: ApiResponse<any> = {
        success: true,
        data: inflationSchedule,
        message: 'Inflation schedule retrieved successfully',
      };

      reply.send(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      reply.status(500).send(response);
    }
  });

  // Route pour obtenir les vesting schedules
  fastify.get('/vesting/:address', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { address } = request.params as any;
      
      const vestingSchedules = await tokenomicsService.getVestingSchedules(address);
      
      const response: ApiResponse<any> = {
        success: true,
        data: vestingSchedules,
        message: 'Vesting schedules retrieved successfully',
      };

      reply.send(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      reply.status(500).send(response);
    }
  });
}
