"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockchainService = exports.BlockchainService = void 0;
const ethers_1 = require("ethers");
class BlockchainService {
    provider;
    wallet;
    constructor() {
        this.provider = new ethers_1.ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545');
        this.wallet = new ethers_1.ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', this.provider);
    }
    async getBalance(address) {
        try {
            const balance = await this.provider.getBalance(address);
            return ethers_1.ethers.formatEther(balance);
        }
        catch (error) {
            throw new Error(`Failed to get balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async transfer(to, amount) {
        try {
            const tx = await this.wallet.sendTransaction({
                to,
                value: ethers_1.ethers.parseEther(amount),
            });
            const transaction = {
                hash: tx.hash,
                from: this.wallet.address,
                to,
                value: amount,
                status: 'pending',
                timestamp: new Date(),
            };
            const receipt = await tx.wait();
            if (receipt) {
                transaction.status = 'confirmed';
                transaction.blockNumber = receipt.blockNumber || undefined;
            }
            return transaction;
        }
        catch (error) {
            throw new Error(`Transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getTransaction(hash) {
        try {
            const tx = await this.provider.getTransaction(hash);
            if (!tx)
                return null;
            const receipt = await this.provider.getTransactionReceipt(hash);
            const transaction = {
                hash: tx.hash,
                from: tx.from || '',
                to: tx.to || '',
                value: ethers_1.ethers.formatEther(tx.value),
                status: receipt ? (receipt.status === 1 ? 'confirmed' : 'failed') : 'pending',
                timestamp: new Date(),
                blockNumber: tx.blockNumber || undefined,
            };
            return transaction;
        }
        catch (error) {
            throw new Error(`Failed to get transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getWalletAddress() {
        return this.wallet.address;
    }
    async getGasPrice() {
        const gasPrice = await this.provider.getFeeData();
        return ethers_1.ethers.formatUnits(gasPrice.gasPrice || 0, 'gwei');
    }
    async getBlockNumber() {
        return await this.provider.getBlockNumber();
    }
}
exports.BlockchainService = BlockchainService;
exports.blockchainService = new BlockchainService();
//# sourceMappingURL=blockchain.service.js.map