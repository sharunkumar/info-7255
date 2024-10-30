import type { Plan } from '../schema/schema';
import type { RedisClient } from './get-redis-client';

export async function deepDeletePlan(
	{ planCostShares, linkedPlanServices }: Plan,
	client: RedisClient,
) {
	await client.json.del(
		`${planCostShares.objectType}:${planCostShares.objectId}`,
	);

	await Promise.all(
		linkedPlanServices.map(async (linkedPlanService) => {
			await client.json.del(
				`${linkedPlanService.objectType}:${linkedPlanService.objectId}`,
			);

			const { linkedService, planserviceCostShares } = linkedPlanService;
			await client.json.del(
				`${linkedService.objectType}:${linkedService.objectId}`,
			);
			await client.json.del(
				`${planserviceCostShares.objectType}:${planserviceCostShares.objectId}`,
			);
		}),
	);
}
