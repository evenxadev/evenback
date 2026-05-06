import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import { FastifyInstance } from "fastify";
import { env } from "../config/env";

export default fp(async function (app: FastifyInstance) {
  await app.register(jwt, {
    secret: env.jwtSecret,
    sign: { expiresIn: "15m" },
  });
});