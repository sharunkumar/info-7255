import { z } from "zod";

// MemberCostShare schema
const MemberCostShareSchema = z.object({
  deductible: z.number(),
  _org: z.string(),
  copay: z.number(),
  objectId: z.string(),
  objectType: z.literal("membercostshare"),
});

// Service schema
const ServiceSchema = z.object({
  _org: z.string(),
  objectId: z.string(),
  objectType: z.literal("service"),
  name: z.string(),
});

// PlanService schema
const PlanServiceSchema = z.object({
  linkedService: ServiceSchema,
  planserviceCostShares: MemberCostShareSchema,
  _org: z.string(),
  objectId: z.string(),
  objectType: z.literal("planservice"),
});

// Plan schema
const PlanSchema = z.object({
  planCostShares: MemberCostShareSchema,
  linkedPlanServices: z.array(PlanServiceSchema),
  _org: z.string(),
  objectId: z.string(),
  objectType: z.literal("plan"),
  planType: z.string(),
  creationDate: z.string(),
});

export { MemberCostShareSchema, PlanSchema, PlanServiceSchema, ServiceSchema };
