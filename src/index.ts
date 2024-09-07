import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { logger } from "hono/logger";
import { hello } from "./routes/hello";

const app = new OpenAPIHono();

app.use(logger());

app.route("/hello", hello);

app.get("/ui", swaggerUI({ url: "swagger.json" }));

app.doc("swagger.json", {
  info: { title: "An API", version: "v1" },
  openapi: "3.1.0",
});

export default app;
