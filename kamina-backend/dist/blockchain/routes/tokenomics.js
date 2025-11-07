"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenomicsRoutes = tokenomicsRoutes;
const tokenomics_service_1 = require("../services/tokenomics.service");
async function tokenomicsRoutes(fastify) {
    fastify.get('/tokenomics', async (request, reply) => {
        try {
            const tokenomicsData = await tokenomics_service_1.tokenomicsService.getTokenomicsData();
            const response = {
                success: true,
                data: tokenomicsData,
                message: 'Tokenomics data retrieved successfully',
            };
            reply.send(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
            reply.status(500).send(response);
        }
    });
    fastify.get('/staking/:address', async (request, reply) => {
        try {
            const { address } = request.params;
            const stakingInfo = await tokenomics_service_1.tokenomicsService.getStakingInfo(address);
            const response = {
                success: true,
                data: stakingInfo,
                message: 'Staking info retrieved successfully',
            };
            reply.send(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
            reply.status(500).send(response);
        }
    });
    fastify.post('/staking/calculate', async (request, reply) => {
        try {
            const { amount, duration } = request.body;
            const rewards = await tokenomics_service_1.tokenomicsService.calculateStakingRewards(amount, duration);
            const response = {
                success: true,
                data: { rewards },
                message: 'Staking rewards calculated successfully',
            };
            reply.send(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
            reply.status(500).send(response);
        }
    });
    fastify.get('/inflation-schedule', async (request, reply) => {
        try {
            const inflationSchedule = await tokenomics_service_1.tokenomicsService.getInflationSchedule();
            const response = {
                success: true,
                data: inflationSchedule,
                message: 'Inflation schedule retrieved successfully',
            };
            reply.send(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
            reply.status(500).send(response);
        }
    });
    fastify.get('/vesting/:address', async (request, reply) => {
        try {
            const { address } = request.params;
            const vestingSchedules = await tokenomics_service_1.tokenomicsService.getVestingSchedules(address);
            const response = {
                success: true,
                data: vestingSchedules,
                message: 'Vesting schedules retrieved successfully',
            };
            reply.send(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
            reply.status(500).send(response);
        }
    });
}
//# sourceMappingURL=tokenomics.js.map