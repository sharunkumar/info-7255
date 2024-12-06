import type { Client } from '@elastic/elasticsearch';
import type { Plan } from '../schema/schema';
import type { RedisClient } from './get-redis-client';

export async function deepSavePlan({ planCostShares, linkedPlanServices }: Plan, redis: RedisClient, elastic: Client) {
  await redis.json.set(`${planCostShares.objectType}:${planCostShares.objectId}`, '$', planCostShares);

  await Promise.all(
    linkedPlanServices.map(async (linkedPlanService) => {
      await redis.json.set(`${linkedPlanService.objectType}:${linkedPlanService.objectId}`, '$', linkedPlanService);

      const { linkedService, planserviceCostShares } = linkedPlanService;
      await redis.json.set(`${linkedService.objectType}:${linkedService.objectId}`, '$', linkedService);
      await redis.json.set(`${planserviceCostShares.objectType}:${planserviceCostShares.objectId}`, '$', planserviceCostShares);
    }),
  );
}
