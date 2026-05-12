import { db } from "../../db/postgres";
import { AppError, ConflictError, UnauthorizedError } from "../../shared/errors";
import { RegisterInput, LoginInput } from "./auth.schema";
import bcrypt from "bcrypt";
import crypto from "crypto";

const CUSTOMER_ROLE_NAME = "customer";
const REFRESH_TOKEN_EXPIRES_DAYS = 7;

export async function registerUser(input: RegisterInput) {
  const existing = await db.query(
    "SELECT id FROM usuarios WHERE email = $1",
    [input.email]
  );
  if (existing.rows.length > 0) {
    throw new ConflictError("El email ya está registrado");
  }

  const password_hash = await bcrypt.hash(input.password, 12);

  const result = await db.query(
    `INSERT INTO usuarios (email, password_hash, nombre, apellido_paterno, apellido_materno, telefono)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, email, nombre, apellido_paterno, apellido_materno, telefono`,
    [input.email, password_hash, input.nombre, input.apellido_paterno, input.apellido_materno ?? null, input.telefono ?? null]
  );

  const user = result.rows[0];

  const roleResult = await db.query(
    "SELECT id FROM roles WHERE name = $1",
    [CUSTOMER_ROLE_NAME]
  );

  if (roleResult.rows.length > 0) {
    await db.query(
      "INSERT INTO usuario_roles (user_id, role_id) VALUES ($1, $2)",
      [user.id, roleResult.rows[0].id]
    );
  }

  return user;
}

export async function loginUser(input: LoginInput) {
  const result = await db.query(
    `SELECT u.id, u.email, u.nombre, u.apellido_paterno, u.apellido_materno,
            u.telefono, u.password_hash, u.is_active, r.name as role
     FROM usuarios u
     LEFT JOIN usuario_roles ur ON ur.user_id = u.id
     LEFT JOIN roles r ON r.id = ur.role_id
     WHERE u.email = $1
     LIMIT 1`,
    [input.email]
  );

  if (result.rows.length === 0) {
    throw new UnauthorizedError();
  }

  const user = result.rows[0];

  if (!user.is_active) {
    throw new AppError("Cuenta desactivada", 403);
  }

  const valid = await bcrypt.compare(input.password, user.password_hash);
  if (!valid) {
    throw new UnauthorizedError();
  }

  const refreshToken = crypto.randomBytes(64).toString("hex");
  const refreshHash = await bcrypt.hash(refreshToken, 10);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

  await db.query(
    `INSERT INTO tokens_refresh (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [user.id, refreshHash, expiresAt]
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido_paterno: user.apellido_paterno,
      apellido_materno: user.apellido_materno,
      telefono: user.telefono,
      role: user.role,
    },
    refreshToken,
  };
}

export async function logoutUser(userId: string) {
  await db.query(
    `UPDATE tokens_refresh 
     SET revoked_at = now() 
     WHERE user_id = $1 AND revoked_at IS NULL`,
    [userId]
  );
}

export async function refreshAccessToken(refreshToken: string) {
  const result = await db.query(
    `SELECT tr.id, tr.token_hash, tr.user_id, tr.expires_at, tr.revoked_at,
            u.email, u.is_active, r.name as role
     FROM tokens_refresh tr
     JOIN usuarios u ON u.id = tr.user_id
     LEFT JOIN usuario_roles ur ON ur.user_id = u.id
     LEFT JOIN roles r ON r.id = ur.role_id
     WHERE tr.expires_at > now()
       AND tr.revoked_at IS NULL`,
    []
  );

  for (const row of result.rows) {
    const valid = await bcrypt.compare(refreshToken, row.token_hash);
    if (valid) {
      if (!row.is_active) throw new AppError("Cuenta desactivada", 403);
      return {
        userId: row.user_id,
        email: row.email,
        role: row.role,
      };
    }
  }

  throw new UnauthorizedError();
}