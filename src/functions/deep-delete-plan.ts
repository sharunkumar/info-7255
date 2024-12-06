import type { Client } from '@elastic/elasticsearch';
import type { Plan } from '../schema/schema';
import type { RedisClient } from './get-redis-client';

export async function deepDeletePlan({ planCostShares, linkedPlanServices }: Plan, redis: RedisClient, elastic: Client) {
  await redis.json.del(`${planCostShares.objectType}:${planCostShares.objectId}`);

  await Promise.all(
    linkedPlanServices.map(async (linkedPlanService) => {
      await redis.json.del(`${linkedPlanService.objectType}:${linkedPlanService.objectId}`);

      const { linkedService, planserviceCostShares } = linkedPlanService;
      await redis.json.del(`${linkedService.objectType}:${linkedService.objectId}`);
      await redis.json.del(`${planserviceCostShares.objectType}:${planserviceCostShares.objectId}`);
    }),
  );
}
