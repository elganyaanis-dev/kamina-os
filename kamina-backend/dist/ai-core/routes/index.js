"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRoutes = aiRoutes;
const ai_service_1 = require("../services/ai.service");
async function aiRoutes(fastify) {
    fastify.post('/chat', async (request, reply) => {
        try {
            const { prompt, context, maxTokens, temperature } = request.body;
            const aiRequest = {
                prompt,
                context,
                maxTokens: maxTokens || 500,
                temperature: temperature || 0.7,
            };
            const response = await ai_service_1.aiService.generateResponse(aiRequest);
            const apiResponse = {
                success: true,
                data: response,
                message: 'AI response generated successfully',
            };
            reply.send(apiResponse);
        }
        catch (error) {
            const response = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
            reply.status(500).send(response);
        }
    });
    fastify.get('/metrics', async (request, reply) => {
        try {
            const metrics = await ai_service_1.aiService.getAIMetrics();
            const response = {
                success: true,
                data: metrics,
                message: 'AI metrics retrieved successfully',
            };
            reply.send(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
            reply.status(500).send(response);
        }
    });
    fastify.post('/analyze-risk', async (request, reply) => {
        try {
            const txData = request.body;
            const analysis = await ai_service_1.aiService.analyzeTransactionRisk(txData);
            const response = {
                success: true,
                data: analysis,
                message: 'Transaction risk analysis completed',
            };
            reply.send(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
            reply.status(500).send(response);
        }
    });
    fastify.get('/health', async (request, reply) => {
        try {
            const metrics = await ai_service_1.aiService.getAIMetrics();
            const healthResponse = {
                status: 'healthy',
                model: metrics.model,
                version: metrics.version,
                latency: metrics.latency,
                timestamp: new Date().toISOString(),
            };
            const response = {
                success: true,
                data: healthResponse,
                message: 'AI service is operational',
            };
            reply.send(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
            reply.status(503).send(response);
        }
    });
}
//# sourceMappingURL=index.js.map