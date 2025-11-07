// src/blockchain/services/blockchain.service.ts
import { ethers } from 'ethers';
import { BlockchainTransaction } from '../../types';

export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;

  constructor() {
    // Pour l'instant, on utilise un provider local
    // Plus tard, on se connectera à Kamina Chain
    this.provider = new ethers.JsonRpcProvider(
      process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545'
    );
    
    this.wallet = new ethers.Wallet(
      process.env.BLOCKCHAIN_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      this.provider
    );
  }

  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      throw new Error(`Failed to get balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async transfer(to: string, amount: string): Promise<BlockchainTransaction> {
    try {
      const tx = await this.wallet.sendTransaction({
        to,
        value: ethers.parseEther(amount),
      });

      const transaction: BlockchainTransaction = {
        hash: tx.hash,
        from: this.wallet.address,
        to,
        value: amount,
        status: 'pending',
        timestamp: new Date(),
      };

      // Attendre la confirmation
      const receipt = await tx.wait();
      if (receipt) {
        transaction.status = 'confirmed';
        transaction.blockNumber = receipt.blockNumber || undefined;
      }

      return transaction;
    } catch (error) {
      throw new Error(`Transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTransaction(hash: string): Promise<BlockchainTransaction | null> {
    try {
      const tx = await this.provider.getTransaction(hash);
      if (!tx) return null;

      const receipt = await this.provider.getTransactionReceipt(hash);

      const transaction: BlockchainTransaction = {
        hash: tx.hash,
        from: tx.from || '',
        to: tx.to || '',
        value: ethers.formatEther(tx.value),
        status: receipt ? (receipt.status === 1 ? 'confirmed' : 'failed') : 'pending',
        timestamp: new Date(),
        blockNumber: tx.blockNumber || undefined,
      };

      return transaction;
    } catch (error) {
      throw new Error(`Failed to get transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getWalletAddress(): Promise<string> {
    return this.wallet.address;
  }

  async getGasPrice(): Promise<string> {
    const gasPrice = await this.provider.getFeeData();
    return ethers.formatUnits(gasPrice.gasPrice || 0, 'gwei');
  }

  async getBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber();
  }
}

export const blockchainService = new BlockchainService();
