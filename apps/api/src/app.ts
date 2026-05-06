import Fastify, { FastifyInstance } from "fastify";
import { env } from "./config/env";
import { testDatabaseConnection } from "./db/postgres";
import { authRoutes } from "./modules/auth/auth.routes";
import { eventosRoutes } from "./modules/eventos/eventos.routes";
import { reservasRoutes } from "./modules/reservas/reservas.routes";
import { pagosRoutes } from "./modules/pagos/pagos.routes";
import corsPlugin from "./plugins/cors";
import jwtPlugin from "./plugins/jwt";

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: env.nodeEnv !== "test",
  });

  // Plugins
  app.register(corsPlugin);
  app.register(jwtPlugin);

  // Rutas de sistema
  app.get("/", async () => ({ message: "Evenxa API running" }));
  app.get("/health", async () => ({ status: "ok" }));
  app.get("/health/db", async (_req, reply) => {
    try {
      const database = await testDatabaseConnection();
      return { status: "ok", database };
    } catch {
      reply.status(503);
      return { status: "error", message: "Database connection failed" };
    }
  });

  // Módulos
  app.register(authRoutes, { prefix: "/auth" });
  app.register(eventosRoutes, { prefix: "/eventos" });
  app.register(reservasRoutes, { prefix: "/reservas" });
  app.register(pagosRoutes, { prefix: "/pagos" });

  return app;
}