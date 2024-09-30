import { createRoute, z } from "@hono/zod-openapi";
export const deletePlanByIdSpec = createRoute({
  method: "delete",
  path: "/{id}",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    204: {
      description: "Plan deleted successfully",
    },
  },
});
