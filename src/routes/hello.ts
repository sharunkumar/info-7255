import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

export const hello = new OpenAPIHono().openapi(
  createRoute({
    method: "get",
    path: "/:name",
    request: {
      params: z.object({
        name: z.string(),
      }),
    },
    responses: {
      200: {
        description: "Respond a message",
        content: {
          "application/json": {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
      },
    },
  }),
  (ctx) => {
    return ctx.json({
      message: "hello " + ctx.req.param("name"),
    });
  }
);
