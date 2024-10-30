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
			if (await client.exists(`plan:${plan.objectId}`)) {
				return c.json({ error: 'Plan already exists' }, 409);
			}
			await client.json.set(`plan:${plan.objectId}`, '$', plan);
			return c.json({ plan }, 201);
		})
		.openapi(getPlanByIdSpec, async (c) => {
			const id = c.req.param('id');
			const planJson = await client.json.get(`plan:${id}`);
			if (!planJson) {
				return c.body(null, 404);
			}
			const { success, data, error } = PlanSchema.safeParse(planJson);
			if (success) {
				return c.json({ plan: data });
			}
			console.error('Error parsing plan data:', error);
			return c.json({ error: 'Invalid plan data in Redis.' }, 500);
		})
		.openapi(deletePlanByIdSpec, async (c) => {
			const id = c.req.param('id');
			const plan = await client.json.get(`plan:${id}`);
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

			if (!(await client.exists(`plan:${id}`))) {
				return c.json({ error: 'Plan not found' }, 404);
			}

			for (const [key, value] of Object.entries(updates)) {
				if (value !== null && typeof value === 'object') {
					if (Array.isArray(value)) {
						await client.json.arrAppend(`plan:${id}`, `$.${key}`, ...value);
					} else {
						await client.json.merge(`plan:${id}`, `$.${key}`, value);
					}
				} else {
					await client.json.set(`plan:${id}`, `$.${key}`, value);
				}
			}
			const updatedPlan = await client.json.get(`plan:${id}`);
			await client.json.set(`plan:${id}`, '$', updatedPlan);
			return c.json({ plan: updatedPlan });
		});
