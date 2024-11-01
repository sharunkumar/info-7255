import { createRoute, z } from '@hono/zod-openapi';
import { PatchPlanSchema } from '../../schema/schema';

export const patchPlanByIdSpec = createRoute({
	method: 'patch',
	path: '/{id}',
	request: {
		params: z.object({
			id: z.string(),
		}),
		body: {
			content: {
				'application/json': {
					schema: PatchPlanSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: 'Plan patched successfully',
			content: {
				'application/json': {
					schema: PatchPlanSchema,
				},
			},
		},
		404: {
			description: 'Plan not found',
		},
	},
});
