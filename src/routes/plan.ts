import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { RedisClient } from "../functions/get-redis-client";
import { PlanSchema } from "../schema/schema";

export const plan = (client: RedisClient) =>
  new OpenAPIHono()
    .openapi(
      createRoute({
        method: "post",
        path: "/",
        request: {
          body: {
            content: {
              "application/json": {
                schema: PlanSchema,
              },
            },
          },
        },
        responses: {
          201: {
            description: "Plan created successfully",
          },
        },
      }),
      async (c) => {
        const plan = c.req.valid("json");

        await client.set(
          `plan--${plan.objectId}`,
          JSON.stringify(plan, null, 2)
        );
        c.status(201);

        return c.body(null);
      }
    )
    .openapi(
      createRoute({
        method: "get",
        path: "/",
        responses: {
          200: {
            description: "List of plans",
            content: {
              "application/json": {
                schema: z.object({
                  plans: z.array(PlanSchema),
                }),
              },
            },
          },
        },
      }),
      async (c) => {
        // TODO: Implement read all logic
        return c.json({ plans: [] });
      }
    )
    .openapi(
      createRoute({
        method: "get",
        path: "/{id}",
        request: {
          params: z.object({
            id: z.string(),
          }),
        },
        responses: {
          200: {
            description: "Specific plan",
            content: {
              "application/json": {
                schema: PlanSchema,
              },
            },
          },
        },
      }),
      // @ts-expect-error: FIXME
      async (c) => {
        const id = c.req.param("id");
        // TODO: Implement read specific logic
        return c.json({ plan: { id } });
      }
    )
    .openapi(
      createRoute({
        method: "put",
        path: "/{id}",
        request: {
          params: z.object({
            id: z.string(),
          }),
          body: {
            content: {
              "application/json": {
                schema: PlanSchema,
              },
            },
          },
        },
        responses: {
          200: {
            description: "Plan updated successfully",
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
      async (c) => {
        const id = c.req.param("id");
        // TODO: Implement update logic
        return c.json({ message: "Plan updated successfully" });
      }
    )
    .openapi(
      createRoute({
        method: "delete",
        path: "/{id}",
        request: {
          params: z.object({
            id: z.string(),
          }),
        },
        responses: {
          200: {
            description: "Plan deleted successfully",
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
      async (c) => {
        const id = c.req.param("id");
        // TODO: Implement delete logic
        return c.json({ message: "Plan deleted successfully" });
      }
    );
