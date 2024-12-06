import type { Client } from '@elastic/elasticsearch';
import type { Plan } from '../schema/schema';
import type { RedisClient } from './get-redis-client';
import { index } from './get-elasticsearch-client';

export async function deepSavePlan(plan: Plan, redis: RedisClient, elastic: Client) {
  const { planCostShares, linkedPlanServices, objectId: planId, ...planData } = plan;

  await elastic.index({
    index,
    id: planId,
    body: {
      ...planData,
      plan_join: {
        name: 'plan',
      },
    },
  });

  await elastic.index({
    index,
    id: planCostShares.objectId,
    routing: planId,
    body: {
      ...planCostShares,
      plan_join: {
        name: 'planCostShares',
        parent: planId,
      },
    },
  });

  await Promise.all(
    linkedPlanServices.map(async (linkedPlanService) => {
      await elastic.index({
        index,
        id: linkedPlanService.objectId,
        routing: planId,
        body: {
          ...linkedPlanService,
          plan_join: {
            name: 'linkedPlanServices',
            parent: planId,
          },
        },
      });

      const { linkedService, planserviceCostShares } = linkedPlanService;

      await elastic.index({
        index,
        id: linkedService.objectId,
        routing: planId,
        body: {
          ...linkedService,
          plan_join: {
            name: 'linkedService',
            parent: linkedPlanService.objectId,
          },
        },
      });

      await elastic.index({
        index,
        id: planserviceCostShares.objectId,
        routing: planId,
        body: {
          ...planserviceCostShares,
          plan_join: {
            name: 'planserviceCostShares',
            parent: linkedPlanService.objectId,
          },
        },
      });

      await redis.json.set(`${linkedPlanService.objectType}:${linkedPlanService.objectId}`, '$', linkedPlanService);
      await redis.json.set(`${linkedService.objectType}:${linkedService.objectId}`, '$', linkedService);
      await redis.json.set(`${planserviceCostShares.objectType}:${planserviceCostShares.objectId}`, '$', planserviceCostShares);
    }),
  );

  await redis.json.set(`${planCostShares.objectType}:${planCostShares.objectId}`, '$', planCostShares);
}
