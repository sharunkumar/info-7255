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

      await client.set(`plan--${plan.objectId}`, JSON.stringify(plan, null, 2));
      c.status(201);

      return c.body(null);
    })
    // .openapi(getAllPlansSpec, async (c) => {
    //   // TODO: Implement read all logic
    //   return c.json({ plans: [] });
    // })
    .openapi(getPlanByIdSpec, async (c) => {
      const id = c.req.param("id");
      const plan = await getRedisValue(client, `plan--${id}`, PlanSchema);
      if (plan == null) {
        c.status(404);
        return c.body(null);
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
      // TODO: Implement delete logic
      return c.json({ message: "Plan deleted successfully" });
    });
