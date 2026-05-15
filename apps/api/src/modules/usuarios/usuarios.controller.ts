import { FastifyRequest, FastifyReply } from "fastify";
import { AppError } from "../../shared/errors";
import { getPerfil } from "./usuarios.service";

export async function getPerfilController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const payload = req.user as { sub: string };
    const perfil = await getPerfil(payload.sub);
    return reply.send({ data: perfil });
  } catch (err) {
    if (err instanceof AppError) {
      return reply.status(err.statusCode).send({ error: err.message });
    }
    throw err;
  }
}