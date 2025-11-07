// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KMINAStaking is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    
    IERC20 public stakingToken;
    
    // Staking parameters
    uint256 public constant MIN_STAKE = 100 * 10**18; // 100 KMINA minimum
    uint256 public constant MAX_STAKE = 10_000_000 * 10**18; // 10M KMINA maximum
    
    // Reward parameters
    uint256 public rewardRate = 1200; // 12% APY in basis points
    uint256 public constant REWARD_PRECISION = 10000;
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;
    
    // Staking data
    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;
    mapping(address => uint256) private _rewards;
    mapping(address => uint256) private _userRewardPerTokenPaid;
    
    // Lock periods for fixed staking
    struct FixedStake {
        uint256 amount;
        uint256 unlockTime;
        uint256 rewardMultiplier;
    }
    
    mapping(address => FixedStake[]) public fixedStakes;
    uint256[] public lockPeriods = [90 days, 180 days, 365 days];
    uint256[] public lockMultipliers = [11000, 12500, 15000]; // 10%, 25%, 50% bonus
    
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event FixedStakeCreated(address indexed user, uint256 amount, uint256 unlockTime, uint256 multiplier);
    event FixedStakeWithdrawn(address indexed user, uint256 amount, uint256 reward);

    constructor(address _stakingToken) {
        stakingToken = IERC20(_stakingToken);
        lastUpdateTime = block.timestamp;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function rewardPerToken() public view returns (uint256) {
        if (_totalSupply == 0) {
            return rewardPerTokenStored;
        }
        return rewardPerTokenStored + 
            (((block.timestamp - lastUpdateTime) * rewardRate * REWARD_PRECISION) / _totalSupply);
    }

    function earned(address account) public view returns (uint256) {
        return (_balances[account] * (rewardPerToken() - _userRewardPerTokenPaid[account]) / REWARD_PRECISION) + _rewards[account];
    }

    function stake(uint256 amount) external nonReentrant updateReward(msg.sender) {
        require(amount >= MIN_STAKE, "KMINA: Below minimum stake");
        require(amount <= MAX_STAKE, "KMINA: Above maximum stake");
        
        _totalSupply += amount;
        _balances[msg.sender] += amount;
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        
        emit Staked(msg.sender, amount);
    }

    function stakeFixed(uint256 amount, uint256 lockIndex) external nonReentrant updateReward(msg.sender) {
        require(lockIndex < lockPeriods.length, "KMINA: Invalid lock period");
        require(amount >= MIN_STAKE, "KMINA: Below minimum stake");
        
        uint256 unlockTime = block.timestamp + lockPeriods[lockIndex];
        uint256 multiplier = lockMultipliers[lockIndex];
        
        fixedStakes[msg.sender].push(FixedStake({
            amount: amount,
            unlockTime: unlockTime,
            rewardMultiplier: multiplier
        }));
        
        _totalSupply += amount;
        _balances[msg.sender] += amount;
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        
        emit FixedStakeCreated(msg.sender, amount, unlockTime, multiplier);
    }

    function withdraw(uint256 amount) public nonReentrant updateReward(msg.sender) {
        require(amount > 0, "KMINA: Cannot withdraw 0");
        require(_balances[msg.sender] >= amount, "KMINA: Insufficient balance");
        
        _totalSupply -= amount;
        _balances[msg.sender] -= amount;
        stakingToken.safeTransfer(msg.sender, amount);
        
        emit Withdrawn(msg.sender, amount);
    }

    function getReward() public nonReentrant updateReward(msg.sender) {
        uint256 reward = _rewards[msg.sender];
        if (reward > 0) {
            _rewards[msg.sender] = 0;
            stakingToken.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    function exit() external {
        withdraw(_balances[msg.sender]);
        getReward();
    }

    // Admin functions
    function setRewardRate(uint256 _rewardRate) external onlyOwner {
        rewardRate = _rewardRate;
    }

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        
        if (account != address(0)) {
            _rewards[account] = earned(account);
            _userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }
}
