import { swaggerUI } from "@hono/swagger-ui";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { logger } from "hono/logger";

const app = new OpenAPIHono();

app.use(logger());

app.openapi(
  createRoute({
    method: "get",
    path: "/hello/:name",
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

app.get("/ui", swaggerUI({ url: "swagger.json" }));

app.doc("swagger.json", {
  info: { title: "An API", version: "v1" },
  openapi: "3.1.0",
});

export default app;
