import { OpenAPIHono } from '@hono/zod-openapi';
import type { RedisClient } from '../../functions/get-redis-client';
import { PlanSchema } from '../../schema/schema';
import { createPlanSpec } from './create-plan';
import { deletePlanByIdSpec } from './delete-plan-by-id';
import { getAllPlansSpec } from './get-all-plans';
import { getPlanByIdSpec } from './get-plan-by-id';
import { patchPlanByIdSpec } from './patch-plan-by-id';
import { deepSavePlan } from '../../functions/deep-save-plan';
import { deepDeletePlan } from '../../functions/deep-delete-plan';
import { etag_internal } from '../../functions/crypto';
import { sendToQueue, type RabbitMQConnection } from '../../functions/get-rabbitmq-connection';

export const plan = (client: RedisClient, rabbit: RabbitMQConnection) =>
  new OpenAPIHono()
    .openapi(createPlanSpec, async (c) => {
      const plan = c.req.valid('json');
      if (await client.exists(`plan:${plan.objectId}`)) {
        return c.json({ error: 'Plan already exists' }, 409);
      }
      await client.json.set(`plan:${plan.objectId}`, '$', plan);
      sendToQueue(rabbit, plan);
      await deepSavePlan(plan, client);
      return c.json(plan, 201);
    })
    .openapi(getPlanByIdSpec, async (c) => {
      const id = c.req.param('id');
      const planJson = await client.json.get(`plan:${id}`);
      if (!planJson) {
        return c.body(null, 404);
      }
      return c.json(PlanSchema.parse(planJson));
    })
    .openapi(deletePlanByIdSpec, async (c) => {
      const id = c.req.param('id');
      const plan = await client.json.get(`plan:${id}`);
      if (plan == null) {
        return c.json({ error: 'Plan does not exist' }, 404);
      }
      await client.json.del(`plan:${id}`);
      await deepDeletePlan(PlanSchema.parse(plan), client);
      return c.body(null, 204);
    })
    .openapi(getAllPlansSpec, async (c) => {
      const planKeys = await client.keys('plan:*');
      const plans = (
        await Promise.allSettled(
          planKeys
            .flatMap(async (key) => {
              const planJson = await client.json.get(key);
              return PlanSchema.parse(planJson);
            })
            .filter((plan) => plan != null),
        )
      ).flatMap((plan) => (plan.status === 'fulfilled' ? plan.value : []));
      return c.json(plans);
    })
    .openapi(patchPlanByIdSpec, async (c) => {
      const ifMatch = c.req.header('If-Match');
      const ifNoneMatch = c.req.header('If-None-Match');
      const id = c.req.param('id');
      const updates = c.req.valid('json');

      if (id !== updates.objectId) {
        return c.json({ error: 'objectId mismatch' }, 412);
      }

      const currentPlan = await client.json.get(`plan:${id}`);
      if (!currentPlan) {
        return c.json({ error: 'Plan not found' }, 404);
      }

      if (ifNoneMatch && ifNoneMatch === (await etag_internal(currentPlan, true))) {
        return c.body(null, 304);
      }

      if (ifMatch == null && ifNoneMatch == null) {
        return c.json({ error: 'Etag required' }, 412);
      }

      if (ifMatch && ifMatch !== (await etag_internal(currentPlan, true))) {
        return c.json({ error: 'Etag mismatch' }, 412);
      }

      await deepDeletePlan(PlanSchema.parse(currentPlan), client);

      for (const [key, value] of Object.entries(updates)) {
        if (value !== null && typeof value === 'object') {
          if (Array.isArray(value)) {
            await client.json.arrAppend(`plan:${id}`, `$.${key}`, ...value);
          } else {
            await client.json.merge(`plan:${id}`, `$.${key}`, value);
          }
        } else {
          await client.json.set(`plan:${id}`, `$.${key}`, value);
        }
      }
      const updatedPlan = await client.json.get(`plan:${id}`);
      await client.json.set(`plan:${id}`, '$', updatedPlan);
      await deepSavePlan(PlanSchema.parse(updatedPlan), client);
      return c.json(PlanSchema.parse(updatedPlan));
    });
