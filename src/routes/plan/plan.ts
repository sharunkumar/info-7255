import { OpenAPIHono } from "@hono/zod-openapi";
import { RedisClient } from "../../functions/get-redis-client";
import { getRedisValue } from "../../functions/get-redis-value";
import { PlanSchema } from "../../schema/schema";
import { createPlanSpec } from "./create-plan";
import { deletePlanByIdSpec } from "./delete-plan-by-id";
import { getPlanByIdSpec } from "./get-plan-by-id";

export const plan = (client: RedisClient) =>
  new OpenAPIHono()
    .openapi(createPlanSpec, async (c) => {
      const plan = c.req.valid("json");

      const existingPlan = await getRedisValue(
        client,
        `plan--${plan.objectId}`,
        PlanSchema
      );

      if (existingPlan) {
        return c.json({ error: "Plan already exists" }, 409);
      }

      await client.set(`plan--${plan.objectId}`, JSON.stringify(plan, null, 2));

      return c.body(null, 201);
    })
    // .openapi(getAllPlansSpec, async (c) => {
    //   // TODO: Implement read all logic
    //   return c.json({ plans: [] });
    // })
    .openapi(getPlanByIdSpec, async (c) => {
      const id = c.req.param("id");
      const plan = await getRedisValue(client, `plan--${id}`, PlanSchema);
      if (plan == null) {
        return c.body(null, 404);
      }
      return c.json({ plan });
    })
    // .openapi(updatePlanByIdSpec, async (c) => {
    //   const id = c.req.param("id");
    //   // TODO: Implement update logic
    //   return c.json({ message: "Plan updated successfully" });
    // })
    .openapi(deletePlanByIdSpec, async (c) => {
      const id = c.req.param("id");
      await client.del(`plan--${id}`);
      return c.body(null, 204);
    });
