/**
 * 🏦 POOL DE STAKING KAMINA OS
 * Récompenses et yield farming
 * Owner: CHABBI MOHAMMED ANIS
 */

class StakingPool {
    constructor() {
        this.totalStaked = 0;
        this.stakers = new Map();
        this.apy = 15.5; // 15.5% APY
        this.initPool();
    }

    initPool() {
        console.log("🏦 INITIALISATION POOL DE STAKING KAMINA OS");
        this.startRewardDistribution();
    }

    stake(user, amount) {
        if (!this.stakers.has(user)) {
            this.stakers.set(user, { amount: 0, rewards: 0, startTime: Date.now() });
        }
        
        const staker = this.stakers.get(user);
        staker.amount += amount;
        this.totalStaked += amount;
        
        console.log(`🎯 ${user} a stake ${amount} KAMINA`);
        return { staked: amount, total: staker.amount };
    }

    startRewardDistribution() {
        setInterval(() => {
            this.distributeRewards();
        }, 60000); // Toutes les minutes
    }

    distributeRewards() {
        const now = Date.now();
        this.stakers.forEach((staker, user) => {
            const stakingTime = (now - staker.startTime) / (1000 * 60 * 60 * 24); // jours
            const dailyReward = (staker.amount * this.apy) / 36500;
            const reward = dailyReward * (stakingTime / 365);
            
            staker.rewards += reward;
            console.log(`💰 ${user}: +${reward.toFixed(4)} KAMINA (rewards)`);
        });
    }

    getPoolStats() {
        return {
            totalStaked: this.totalStaked,
            stakersCount: this.stakers.size,
            apy: this.apy,
            totalRewards: Array.from(this.stakers.values())
                .reduce((sum, staker) => sum + staker.rewards, 0)
        };
    }
}

module.exports = StakingPool;
