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
export declare class TokenomicsService {
    private provider;
    private tokenContract;
    private stakingContract;
    constructor();
    getTokenomicsData(): Promise<TokenomicsData>;
    getStakingInfo(walletAddress: string): Promise<StakingInfo>;
    calculateStakingRewards(amount: string, duration: number): Promise<string>;
    getInflationSchedule(): Promise<Array<{
        year: number;
        rate: string;
    }>>;
    getVestingSchedules(walletAddress: string): Promise<Array<{
        type: string;
        totalAmount: string;
        released: string;
        remaining: string;
        nextUnlock: string;
    }>>;
}
export declare const tokenomicsService: TokenomicsService;
//# sourceMappingURL=tokenomics.service.d.ts.map