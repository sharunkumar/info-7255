import { PrismaClient } from "@prisma/client";
import { basicAuth } from "hono/basic-auth";
import { verify } from "../functions/crypto";

export const auth = (prisma: PrismaClient) =>
  basicAuth({
    verifyUser: async (username, password, c) => {
      try {
        const { password: dbPassword } = await prisma.user.findFirstOrThrow({
          where: {
            email: username,
          },
          select: {
            password: true,
          },
        });
        return verify(password, dbPassword);
      } catch (error) {
        return false;
      }
    },
  });
