import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const user = new OpenAPIHono().openapi(
  createRoute({
    method: "get",
    path: "/all",
    responses: {
      200: {
        description: "User list",
        content: {
          "application/json": {
            schema: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                email: z.string(),
              })
            ),
          },
        },
      },
    },
  }),
  async (ctx) => {
    return ctx.json(
      await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
        },
      })
    );
  }
);
