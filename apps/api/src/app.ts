import Fastify from "fastify";
import { testDatabaseConnection } from "./db/postgres";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.get("/", async () => {
    return {
      message: "Evenxa API running",
    };
  });

  app.get("/health/db", async () => {
    const database = await testDatabaseConnection();

    return {
      status: "ok",
      database,
    };
  });

  return app;
}