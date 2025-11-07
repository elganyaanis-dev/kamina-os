// src/blockchain/services/tokenomics.service.ts
import { ethers } from 'ethers';

export interface TokenomicsData {
  totalSupply: string;
  circulatingSupply: string;
  marketCap: string;
  price: string;
  stakedAmount: string;
  stakingAPY: string;
  inflationRate: string;
  burnedAmount: string;
}

export interface StakingInfo {
  userStaked: string;
  userRewards: string;
  totalStaked: string;
  apy: string;
  lockPeriods: Array<{
    duration: number;
    multiplier: number;
    apy: string;
  }>;
}

export class TokenomicsService {
  private provider: ethers.JsonRpcProvider;
  private tokenContract: ethers.Contract;
  private stakingContract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545'
    );

    // Mock contracts for development
    // In production, use real contract addresses
    this.tokenContract = new ethers.Contract(
      process.env.KMINA_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000',
      [
        'function totalSupply() view returns (uint256)',
        'function balanceOf(address) view returns (uint256)',
        'function circulatingSupply() view returns (uint256)'
      ],
      this.provider
    );

    this.stakingContract = new ethers.Contract(
      process.env.STAKING_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
      [
        'function totalSupply() view returns (uint256)',
        'function balanceOf(address) view returns (uint256)',
        'function earned(address) view returns (uint256)',
        'function rewardRate() view returns (uint256)'
      ],
      this.provider
    );
  }

  async getTokenomicsData(): Promise<TokenomicsData> {
    try {
      // Mock data for development
      // In production, fetch from blockchain
      const mockData: TokenomicsData = {
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
    } catch (error) {
      throw new Error(`Failed to fetch tokenomics data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getStakingInfo(walletAddress: string): Promise<StakingInfo> {
    try {
      // Mock staking data
      const stakingInfo: StakingInfo = {
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
    } catch (error) {
      throw new Error(`Failed to fetch staking info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async calculateStakingRewards(amount: string, duration: number): Promise<string> {
    const baseAPY = 0.125; // 12.5%
    let multiplier = 1.0;

    if (duration >= 365) multiplier = 1.5;
    else if (duration >= 180) multiplier = 1.25;
    else if (duration >= 90) multiplier = 1.1;

    const effectiveAPY = baseAPY * multiplier;
    const numericAmount = parseFloat(amount.replace(/,/g, ''));
    const annualReward = numericAmount * effectiveAPY;
    const durationReward = (annualReward * duration) / 365;

    return durationReward.toFixed(2);
  }

  async getInflationSchedule(): Promise<Array<{ year: number; rate: string }>> {
    return [
      { year: 1, rate: '8.0%' },
      { year: 2, rate: '6.0%' },
      { year: 3, rate: '4.0%' },
      { year: 4, rate: '2.0%' },
      { year: 5, rate: '2.0%' }
    ];
  }

  async getVestingSchedules(walletAddress: string): Promise<Array<{
    type: string;
    totalAmount: string;
    released: string;
    remaining: string;
    nextUnlock: string;
  }>> {
    // Mock vesting data
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

export const tokenomicsService = new TokenomicsService();
