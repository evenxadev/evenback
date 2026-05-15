import { FastifyInstance } from "fastify";
import { requireAuth } from "../../middlewares/auth.guard";
import { 
  getPerfilController, 
  actualizarPerfilController,
  eliminarCuentaController
} from "./usuarios.controller";

export async function usuariosRoutes(app: FastifyInstance) {
  app.get("/perfil", { preHandler: [requireAuth] }, getPerfilController);
  app.put("/actualizar-perfil", { preHandler: [requireAuth] }, actualizarPerfilController);
  app.delete("/eliminar-cuenta", { preHandler: [requireAuth] }, eliminarCuentaController);
}