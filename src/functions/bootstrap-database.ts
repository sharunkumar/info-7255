import { PrismaClient } from "@prisma/client";
import { hash } from "./crypto";

export async function bootstrapDatabase(prisma: PrismaClient) {
  const hashedPassword = await hash("password");
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "admin",
      password: hashedPassword,
    },
  });
  console.log("Database bootstrapped successfully");
}
