import { AIRequest, AIResponse } from '../../types';
export declare class AIService {
    private apiKey;
    private baseURL;
    constructor();
    generateResponse(request: AIRequest): Promise<AIResponse>;
    private simulateAIResponse;
    getAIMetrics(): Promise<any>;
    analyzeTransactionRisk(txData: any): Promise<any>;
}
export declare const aiService: AIService;
//# sourceMappingURL=ai.service.d.ts.map