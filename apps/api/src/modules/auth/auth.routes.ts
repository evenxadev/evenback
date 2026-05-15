import { FastifyInstance } from "fastify";
import {
  registerController,
  loginController,
  logoutController,
  refreshController,
  verificarEmailController,
  reenviarCodigoController,
  solicitarRecuperacionController,
  verificarCodigoResetController,
  resetPasswordController,
} from "./auth.controller";
import { requireAuth } from "../../middlewares/auth.guard";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", registerController);
  app.post("/login", loginController);
  app.post("/refresh", refreshController);
  app.post("/logout", { preHandler: [requireAuth] }, logoutController);
  app.post("/verificar-email", verificarEmailController);
  app.post("/reenviar-codigo", reenviarCodigoController);
  app.post("/recuperar-password", solicitarRecuperacionController);
  app.post("/verificar-codigo-reset", verificarCodigoResetController);
  app.post("/reset-password", resetPasswordController);
}