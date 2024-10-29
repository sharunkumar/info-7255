import { OpenAPIHono } from '@hono/zod-openapi';
import type { RedisClient } from '../../functions/get-redis-client';
import { PlanSchema } from '../../schema/schema';
import { createPlanSpec } from './create-plan';
import { deletePlanByIdSpec } from './delete-plan-by-id';
import { getAllPlansSpec } from './get-all-plans';
import { getPlanByIdSpec } from './get-plan-by-id';
import { patchPlanByIdSpec } from './patch-plan-by-id';

export const plan = (client: RedisClient) =>
	new OpenAPIHono()
		.openapi(createPlanSpec, async (c) => {
			const plan = c.req.valid('json');
			if (await client.hGet('plan', plan.objectId)) {
				return c.json({ error: 'Plan already exists' }, 409);
			}
			await client.hSet('plan', plan.objectId, JSON.stringify(plan));
			return c.json({ plan }, 201);
		})
		.openapi(getPlanByIdSpec, async (c) => {
			const id = c.req.param('id');
			const planJson = await client.hGet('plan', id);
			if (!planJson) {
				return c.body(null, 404);
			}
			const { success, data, error } = PlanSchema.safeParse(
				JSON.parse(planJson),
			);
			if (success) {
				return c.json({ plan: data });
			}
			console.error('Error parsing plan data:', error);
			return c.json({ error: 'Invalid plan data in Redis.' }, 500);
		})
		.openapi(deletePlanByIdSpec, async (c) => {
			const id = c.req.param('id');
			const plan = await client.hGet('plan', id);
			if (plan == null) {
				return c.json({ error: 'Plan does not exist' }, 404);
			}
			await client.hDel('plan', id);
			return c.body(null, 204);
		})
		.openapi(getAllPlansSpec, async (c) => {
			const planHash = await client.hGetAll('plan');
			const plans = Object.values(planHash).map((planJson) => {
				return JSON.parse(planJson);
			});
			return c.json({ plans: plans ?? [] });
		})
		.openapi(patchPlanByIdSpec, async (c) => {
			const id = c.req.param('id');
			const updates = c.req.valid('json');

			const existingPlanJson = await client.hGet('plan', id);
			if (!existingPlanJson) {
				return c.json({ error: 'Plan not found' }, 404);
			}

			const existingPlan = JSON.parse(existingPlanJson);
			const updatedPlan = { ...existingPlan, ...updates };

			await client.hSet('plan', id, JSON.stringify(updatedPlan));
			return c.json({ plan: updatedPlan });
		});
