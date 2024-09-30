import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { PrismaClient } from "@prisma/client";
import { logger } from "hono/logger";
import { bootstrapDatabase } from "./functions/bootstrap-database";
import { getRedisClient } from "./functions/get-redis-client";
import { auth } from "./middleware/auth";
import { plan } from "./routes/plan/plan";
import { user } from "./routes/user";

const app = new OpenAPIHono();
const prismaClient = new PrismaClient();
const redisClient = await getRedisClient();

app.use(logger());

app.use(auth(prismaClient));

app.route("/user", user);
app.route("/plan", plan(redisClient));

app.get("/ui", swaggerUI({ url: "swagger.json" }));

app.doc("swagger.json", {
  info: { title: "INFO7255", version: "v1" },
  openapi: "3.1.0",
});

await bootstrapDatabase(prismaClient);

export default app;
