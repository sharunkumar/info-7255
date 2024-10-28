import { createRoute, z } from '@hono/zod-openapi';
import { GetPlanSchema, PlanSchema } from '../../schema/schema';
export const getPlanByIdSpec = createRoute({
	method: 'get',
	path: '/{id}',
	request: {
		params: z.object({
			id: z.string(),
		}),
	},
	responses: {
		200: {
			description: 'Specific plan',
			content: {
				'application/json': {
					schema: GetPlanSchema,
				},
			},
		},
		404: {
			description: 'Plan not found',
		},
	},
});
