import { FastifyInstance } from "fastify";
import {
  registerController,
  loginController,
  logoutController,
} from "./auth.controller";
import { requireAuth } from "../../middlewares/auth.guard";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", registerController);
  app.post("/login", loginController);
  app.post("/logout", { preHandler: [requireAuth] }, logoutController);
}