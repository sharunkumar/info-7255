import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { PrismaClient } from "@prisma/client";
import { logger } from "hono/logger";
import { createClient } from "redis";
import { bootstrapDatabase } from "./functions/bootstrap-database";
import { auth } from "./middleware/auth";
import { plan } from "./routes/plan";
import { user } from "./routes/user";

const app = new OpenAPIHono();
const prismaClient = new PrismaClient();
const redisClient = await createClient({ url: process.env.REDIS_URL })
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

app.use(logger());

app.use(auth(prismaClient));

app.route("/user", user);
app.route("/plan", plan);

app.get("/ui", swaggerUI({ url: "swagger.json" }));

app.doc("swagger.json", {
  info: { title: "INFO7255", version: "v1" },
  openapi: "3.1.0",
});

await bootstrapDatabase(prismaClient);

export default app;
