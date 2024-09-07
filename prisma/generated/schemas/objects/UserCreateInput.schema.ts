import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateInput> = z
  .object({
    email: z.string(),
    name: z.string().optional().nullable(),
  })
  .strict();

export const UserCreateInputObjectSchema = Schema;
