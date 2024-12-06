import { z } from 'zod';

export const ObjectBasicSchema = z.object({
  objectType: z.string(),
  objectId: z.string(),
  _org: z.string(),
});

export const MemberCostShareSchema = ObjectBasicSchema.merge(
  z.object({
    deductible: z.number().nonnegative(),
    copay: z.number().nonnegative(),
    objectType: z.literal('membercostshare'),
  }),
);

export const ServiceSchema = ObjectBasicSchema.merge(
  z.object({
    name: z.string(),
    objectType: z.literal('service'),
  }),
);

export const PlanServiceSchema = ObjectBasicSchema.merge(
  z.object({
    linkedService: ServiceSchema,
    planserviceCostShares: MemberCostShareSchema,
    objectType: z.literal('planservice'),
  }),
);

export const PlanSchema = ObjectBasicSchema.merge(
  z.object({
    planCostShares: MemberCostShareSchema,
    linkedPlanServices: z.array(PlanServiceSchema),
    planType: z.string(),
    creationDate: z.string(),
    objectType: z.literal('plan'),
  }),
).strict();

export const PatchPlanSchema = z
  .object({
    planCostShares: MemberCostShareSchema.optional(),
    linkedPlanServices: z.array(PlanServiceSchema).optional(),
    _org: z.string().optional(),
    objectId: z.string().optional(),
    objectType: z.literal('plan').optional(),
    planType: z.string().optional(),
    creationDate: z.string().optional(),
  })
  .strict();

export type Plan = z.infer<typeof PlanSchema>;
export type PatchPlan = z.infer<typeof PatchPlanSchema>;
