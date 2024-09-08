import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { PrismaClient } from "@prisma/client";
import { logger } from "hono/logger";
import { bootstrapDatabase } from "./functions/bootstrap-database";
import { hello } from "./routes/hello";
import { user } from "./routes/user";

const app = new OpenAPIHono();

app.use(logger());

app.route("/hello", hello);
app.route("/user", user);

app.get("/ui", swaggerUI({ url: "swagger.json" }));

app.doc("swagger.json", {
  info: { title: "INFO7255", version: "v1" },
  openapi: "3.1.0",
});

bootstrapDatabase(new PrismaClient());

export default app;
