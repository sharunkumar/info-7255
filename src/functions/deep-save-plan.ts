import type { Plan } from '../schema/schema';
import type { RedisClient } from './get-redis-client';

export async function deepSavePlan({ planCostShares, linkedPlanServices }: Plan, client: RedisClient) {
	await client.json.set(`${planCostShares.objectType}:${planCostShares.objectId}`, '$', planCostShares);

	await Promise.all(
		linkedPlanServices.map(async (linkedPlanService) => {
			await client.json.set(`${linkedPlanService.objectType}:${linkedPlanService.objectId}`, '$', linkedPlanService);

			const { linkedService, planserviceCostShares } = linkedPlanService;
			await client.json.set(`${linkedService.objectType}:${linkedService.objectId}`, '$', linkedService);
			await client.json.set(`${planserviceCostShares.objectType}:${planserviceCostShares.objectId}`, '$', planserviceCostShares);
		}),
	);
}
