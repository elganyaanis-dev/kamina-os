// src/ai-core/routes/index.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { aiService } from '../services/ai.service';
import { AIRequest, ApiResponse } from '../../types';

export async function aiRoutes(fastify: FastifyInstance) {
  // Route pour interagir avec l'AI
  fastify.post('/chat', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { prompt, context, maxTokens, temperature } = request.body as AIRequest;
      
      const aiRequest: AIRequest = {
        prompt,
        context,
        maxTokens: maxTokens || 500,
        temperature: temperature || 0.7,
      };

      const response = await aiService.generateResponse(aiRequest);
      
      const apiResponse: ApiResponse<any> = {
        success: true,
        data: response,
        message: 'AI response generated successfully',
      };

      reply.send(apiResponse);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      reply.status(500).send(response);
    }
  });

  // Route pour obtenir les métriques de l'AI
  fastify.get('/metrics', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const metrics = await aiService.getAIMetrics();
      
      const response: ApiResponse<any> = {
        success: true,
        data: metrics,
        message: 'AI metrics retrieved successfully',
      };

      reply.send(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      reply.status(500).send(response);
    }
  });

  // Route pour analyser les risques des transactions
  fastify.post('/analyze-risk', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const txData = request.body as any;
      
      const analysis = await aiService.analyzeTransactionRisk(txData);
      
      const response: ApiResponse<any> = {
        success: true,
        data: analysis,
        message: 'Transaction risk analysis completed',
      };

      reply.send(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      reply.status(500).send(response);
    }
  });

  // Route pour la santé de l'AI
  fastify.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const metrics = await aiService.getAIMetrics();
      
      const healthResponse = {
        status: 'healthy',
        model: metrics.model,
        version: metrics.version,
        latency: metrics.latency,
        timestamp: new Date().toISOString(),
      };

      const response: ApiResponse<any> = {
        success: true,
        data: healthResponse,
        message: 'AI service is operational',
      };

      reply.send(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      reply.status(503).send(response);
    }
  });
}
