import { zodToJsonSchema } from 'zod-to-json-schema';
import { PlanSchema } from '../schema/schema';

const planSchema = zodToJsonSchema(PlanSchema, 'PlanSchema');

Bun.write('src/schema/plan.schema.json', JSON.stringify(planSchema, null, 2));
