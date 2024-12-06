import { createRoute, z } from '@hono/zod-openapi';
import { PlanSchema } from '../../schema/schema';

export const getAllPlansSpec = createRoute({
  method: 'get',
  path: '/',
  responses: {
    200: {
      description: 'List of plans',
      content: {
        'application/json': {
          schema: z.array(PlanSchema),
        },
      },
    },
  },
});
