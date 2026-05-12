import { FastifyInstance } from "fastify";
import {
  registerController,
  loginController,
  logoutController,
  refreshController,
} from "./auth.controller";
import { requireAuth } from "../../middlewares/auth.guard";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", registerController);
  app.post("/login", loginController);
  app.post("/refresh", refreshController);
  app.post("/logout", { preHandler: [requireAuth] }, logoutController);
}