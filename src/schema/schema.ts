import { z } from 'zod';

const ObjectBasicSchema = z.object({
	objectType: z.string(),
	objectId: z.string(),
	_org: z.string(),
});

const MemberCostShareSchema = ObjectBasicSchema.merge(
	z.object({
		deductible: z.number().nonnegative(),
		copay: z.number().nonnegative(),
		objectType: z.literal('membercostshare'),
	}),
);

const ServiceSchema = ObjectBasicSchema.merge(
	z.object({
		name: z.string(),
		objectType: z.literal('service'),
	}),
);

const PlanServiceSchema = ObjectBasicSchema.merge(
	z.object({
		linkedService: ServiceSchema,
		planserviceCostShares: MemberCostShareSchema,
		objectType: z.literal('planservice'),
	}),
);

const PlanSchema = ObjectBasicSchema.merge(
	z.object({
		planCostShares: MemberCostShareSchema,
		linkedPlanServices: z.array(PlanServiceSchema),
		planType: z.string(),
		creationDate: z.string(),
		objectType: z.literal('plan'),
	}),
);

const PatchPlanSchema = z.object({
	planCostShares: MemberCostShareSchema.optional(),
	linkedPlanServices: z.array(PlanServiceSchema).optional(),
	_org: z.string().optional(),
	objectId: z.string().optional(),
	objectType: z.literal('plan').optional(),
	planType: z.string().optional(),
	creationDate: z.string().optional(),
});

type Plan = z.infer<typeof PlanSchema>;
type PatchPlan = z.infer<typeof PatchPlanSchema>;

export {
	MemberCostShareSchema,
	PlanSchema,
	PlanServiceSchema,
	ServiceSchema,
	PatchPlanSchema,
	ObjectBasicSchema,
	type Plan,
	type PatchPlan,
};
