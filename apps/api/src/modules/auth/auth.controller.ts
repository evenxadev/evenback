import { FastifyRequest, FastifyReply } from "fastify";
import { registerSchema, loginSchema, refreshSchema } from "./auth.schema";
import { registerUser, loginUser, logoutUser, refreshAccessToken } from "./auth.service";
import { AppError } from "../../shared/errors";

export async function registerController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const input = registerSchema.parse(req.body);
    const user = await registerUser(input);
    return reply.status(201).send({ data: user });
  } catch (err) {
    if (err instanceof AppError) {
      return reply.status(err.statusCode).send({ error: err.message });
    }
    throw err;
  }
}

export async function loginController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const input = loginSchema.parse(req.body);
    const { user, refreshToken } = await loginUser(input);

    const accessToken = await reply.jwtSign(
      { sub: user.id, email: user.email, role: user.role },
      { expiresIn: "15m" }
    );

    return reply.send({
      data: { user, accessToken, refreshToken },
    });
  } catch (err) {
    if (err instanceof AppError) {
      return reply.status(err.statusCode).send({ error: err.message });
    }
    throw err;
  }
}

export async function logoutController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const payload = req.user as { sub: string };
    await logoutUser(payload.sub);
    return reply.send({ message: "Sesión cerrada" });
  } catch (err) {
    if (err instanceof AppError) {
      return reply.status(err.statusCode).send({ error: err.message });
    }
    throw err;
  }
}

export async function refreshController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { refresh_token } = refreshSchema.parse(req.body);
    const { userId, email, role } = await refreshAccessToken(refresh_token);

    const accessToken = await reply.jwtSign(
      { sub: userId, email, role },
      { expiresIn: "15m" }
    );

    return reply.send({ data: { accessToken } });
  } catch (err) {
    if (err instanceof AppError) {
      return reply.status(err.statusCode).send({ error: err.message });
    }
    throw err;
  }
}