export interface User {
    id: string;
    walletAddress: string;
    publicKey?: string;
    username?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface AuthChallenge {
    challenge: string;
    walletAddress: string;
    expiresAt: Date;
}
export interface BlockchainTransaction {
    hash: string;
    from: string;
    to: string;
    value: string;
    status: 'pending' | 'confirmed' | 'failed';
    timestamp: Date;
    blockNumber?: number;
}
export interface AIRequest {
    prompt: string;
    context?: string;
    maxTokens?: number;
    temperature?: number;
}
export interface AIResponse {
    response: string;
    tokensUsed: number;
    timestamp: Date;
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface HealthStatus {
    status: 'ok' | 'error';
    timestamp: string;
    version: string;
    services: {
        blockchain: 'connected' | 'disconnected';
        database: 'connected' | 'disconnected';
        cache: 'connected' | 'disconnected';
        ai: 'connected' | 'disconnected';
    };
}
//# sourceMappingURL=index.d.ts.map