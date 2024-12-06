import { createRoute, z } from '@hono/zod-openapi';
import { PlanSchema } from '../../schema/schema';
export const updatePlanByIdSpec = createRoute({
  method: 'put',
  path: '/{id}',
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: {
      content: {
        'application/json': {
          schema: PlanSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Plan updated successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
  },
});
