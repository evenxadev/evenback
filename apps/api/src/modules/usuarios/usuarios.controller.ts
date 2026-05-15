import { FastifyRequest, FastifyReply } from "fastify";
import { AppError } from "../../shared/errors";
import { getPerfil, actualizarPerfil, eliminarCuenta } from "./usuarios.service";

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

export async function actualizarPerfilController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const payload = req.user as { sub: string };
    const input = req.body as {
      nombre?: string;
      apellido_paterno?: string;
      apellido_materno?: string;
      telefono?: string;
      curp?: string;
      fecha_nacimiento?: string;
    };
    const perfil = await actualizarPerfil(payload.sub, input);
    return reply.send({ data: perfil });
  } catch (err) {
    if (err instanceof AppError) {
      return reply.status(err.statusCode).send({ error: err.message });
    }
    throw err;
  }
}

export async function eliminarCuentaController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const payload = req.user as { sub: string };
    const result = await eliminarCuenta(payload.sub);
    return reply.send(result);
  } catch (err) {
    if (err instanceof AppError) {
      return reply.status(err.statusCode).send({ error: err.message });
    }
    throw err;
  }
}