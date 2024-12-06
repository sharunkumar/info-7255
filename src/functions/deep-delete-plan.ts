import type { Client } from '@elastic/elasticsearch';
import type { Plan } from '../schema/schema';
import type { RedisClient } from './get-redis-client';
import { index } from './get-elasticsearch-client';

export async function deepDeletePlan({ objectId: planId, planCostShares, linkedPlanServices }: Plan, redis: RedisClient, elastic: Client) {
  await redis.json.del(`${planCostShares.objectType}:${planCostShares.objectId}`);

  await elastic.delete({
    index,
    id: planCostShares.objectId,
    routing: planId,
  });

  await Promise.all(
    linkedPlanServices.map(async (linkedPlanService) => {
      await redis.json.del(`${linkedPlanService.objectType}:${linkedPlanService.objectId}`);

      const { linkedService, planserviceCostShares } = linkedPlanService;
      await redis.json.del(`${linkedService.objectType}:${linkedService.objectId}`);
      await redis.json.del(`${planserviceCostShares.objectType}:${planserviceCostShares.objectId}`);

      await elastic.delete({
        index,
        id: linkedPlanService.objectId,
        routing: planId,
      });

      await elastic.delete({
        index,
        id: linkedService.objectId,
        routing: planId,
      });

      await elastic.delete({
        index,
        id: planserviceCostShares.objectId,
        routing: planId,
      });
    }),
  );

  await elastic.delete({
    index,
    id: planId,
  });
}
