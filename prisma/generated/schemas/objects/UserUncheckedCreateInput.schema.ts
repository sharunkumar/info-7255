import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUncheckedCreateInput> = z
  .object({
    id: z.number().optional(),
    email: z.string(),
    name: z.string(),
  })
  .strict();

export const UserUncheckedCreateInputObjectSchema = Schema;
