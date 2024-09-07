import { swaggerUI } from "@hono/swagger-ui";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const app = new OpenAPIHono();

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
  (c) => {
    return c.json({
      message: "hello " + c.req.param("name"),
    });
  }
);

app.get("/ui", swaggerUI({ url: "/doc" }));

app.doc("/doc", { info: { title: "An API", version: "v1" }, openapi: "3.1.0" });

export default app;
