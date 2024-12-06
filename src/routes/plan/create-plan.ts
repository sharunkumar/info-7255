import { createRoute } from '@hono/zod-openapi';
import { PlanSchema } from '../../schema/schema';
export const createPlanSpec = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: PlanSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Plan created successfully',
    },
    409: {
      description: 'Plan already exists',
    },
  },
});
