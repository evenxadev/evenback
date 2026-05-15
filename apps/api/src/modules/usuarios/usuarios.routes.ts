import { FastifyInstance } from "fastify";
import { requireAuth } from "../../middlewares/auth.guard";
import { getPerfilController } from "./usuarios.controller";

export async function usuariosRoutes(app: FastifyInstance) {
  app.get("/perfil", { preHandler: [requireAuth] }, getPerfilController);
}