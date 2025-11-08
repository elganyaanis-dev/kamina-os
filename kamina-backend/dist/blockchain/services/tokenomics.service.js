"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenomicsService = exports.TokenomicsService = void 0;
const ethers_1 = require("ethers");
class TokenomicsService {
    provider;
    tokenContract;
    stakingContract;
    constructor() {
        this.provider = new ethers_1.ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545');
        this.tokenContract = new ethers_1.ethers.Contract(process.env.KMINA_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000', [
            'function totalSupply() view returns (uint256)',
            'function balanceOf(address) view returns (uint256)',
            'function circulatingSupply() view returns (uint256)'
        ], this.provider);
        this.stakingContract = new ethers_1.ethers.Contract(process.env.STAKING_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000', [
            'function totalSupply() view returns (uint256)',
            'function balanceOf(address) view returns (uint256)',
            'function earned(address) view returns (uint256)',
            'function rewardRate() view returns (uint256)'
        ], this.provider);
    }
    async getTokenomicsData() {
        try {
            const mockData = {
                totalSupply: '1,000,000,000',
                circulatingSupply: '350,000,000',
                marketCap: '$4,200,000',
                price: '$0.012',
                stakedAmount: '85,000,000',
                stakingAPY: '12.5%',
                inflationRate: '8.0%',
                burnedAmount: '5,250,000'
            };
            return mockData;
        }
        catch (error) {
            throw new Error(`Failed to fetch tokenomics data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getStakingInfo(walletAddress) {
        try {
            const stakingInfo = {
                userStaked: walletAddress ? '12,500' : '0',
                userRewards: walletAddress ? '1,250' : '0',
                totalStaked: '85,000,000',
                apy: '12.5%',
                lockPeriods: [
                    {
                        duration: 90,
                        multiplier: 1.1,
                        apy: '13.75%'
                    },
                    {
                        duration: 180,
                        multiplier: 1.25,
                        apy: '15.63%'
                    },
                    {
                        duration: 365,
                        multiplier: 1.5,
                        apy: '18.75%'
                    }
                ]
            };
            return stakingInfo;
        }
        catch (error) {
            throw new Error(`Failed to fetch staking info: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async calculateStakingRewards(amount, duration) {
        const baseAPY = 0.125;
        let multiplier = 1.0;
        if (duration >= 365)
            multiplier = 1.5;
        else if (duration >= 180)
            multiplier = 1.25;
        else if (duration >= 90)
            multiplier = 1.1;
        const effectiveAPY = baseAPY * multiplier;
        const numericAmount = parseFloat(amount.replace(/,/g, ''));
        const annualReward = numericAmount * effectiveAPY;
        const durationReward = (annualReward * duration) / 365;
        return durationReward.toFixed(2);
    }
    async getInflationSchedule() {
        return [
            { year: 1, rate: '8.0%' },
            { year: 2, rate: '6.0%' },
            { year: 3, rate: '4.0%' },
            { year: 4, rate: '2.0%' },
            { year: 5, rate: '2.0%' }
        ];
    }
    async getVestingSchedules(walletAddress) {
        return [
            {
                type: 'Team Allocation',
                totalAmount: '150,000',
                released: '45,000',
                remaining: '105,000',
                nextUnlock: '2024-06-01'
            },
            {
                type: 'Advisor Allocation',
                totalAmount: '50,000',
                released: '15,000',
                remaining: '35,000',
                nextUnlock: '2024-03-15'
            }
        ];
    }
}
exports.TokenomicsService = TokenomicsService;
exports.tokenomicsService = new TokenomicsService();
//# sourceMappingURL=tokenomics.service.js.map