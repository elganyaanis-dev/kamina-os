import { BlockchainTransaction } from '../../types';
export declare class BlockchainService {
    private provider;
    private wallet;
    constructor();
    getBalance(address: string): Promise<string>;
    transfer(to: string, amount: string): Promise<BlockchainTransaction>;
    getTransaction(hash: string): Promise<BlockchainTransaction | null>;
    getWalletAddress(): Promise<string>;
    getGasPrice(): Promise<string>;
    getBlockNumber(): Promise<number>;
}
export declare const blockchainService: BlockchainService;
//# sourceMappingURL=blockchain.service.d.ts.map