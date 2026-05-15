import { db } from "../../db/postgres";
import { AppError } from "../../shared/errors";

export async function getPerfil(userId: string) {
  const result = await db.query(
    `SELECT u.id, u.email, u.nombre, u.apellido_paterno, u.apellido_materno,
            u.telefono, u.curp, u.fecha_nacimiento, u.email_verified, u.is_active,
            r.name as rol, u.created_at
     FROM usuarios u
     LEFT JOIN usuario_roles ur ON ur.user_id = u.id
     LEFT JOIN roles r ON r.id = ur.role_id
     WHERE u.id = $1`,
    [userId]
  );

  if (result.rows.length === 0) throw new AppError("Usuario no encontrado", 404);

  return result.rows[0];
}

export async function actualizarPerfil(userId: string, input: {
  nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  telefono?: string;
  curp?: string;
  fecha_nacimiento?: string;
}) {
  const result = await db.query(
    `UPDATE usuarios 
     SET nombre = COALESCE($1, nombre),
         apellido_paterno = COALESCE($2, apellido_paterno),
         apellido_materno = COALESCE($3, apellido_materno),
         telefono = COALESCE($4, telefono),
         curp = COALESCE($5, curp),
         fecha_nacimiento = COALESCE($6, fecha_nacimiento),
         updated_at = now()
     WHERE id = $7
     RETURNING id, email, nombre, apellido_paterno, apellido_materno, telefono, curp, fecha_nacimiento`,
    [input.nombre, input.apellido_paterno, input.apellido_materno, input.telefono, input.curp, input.fecha_nacimiento, userId]
  );

  return result.rows[0];
}

export async function eliminarCuenta(userId: string) {
  await db.query(
    `UPDATE usuarios SET is_active = false, updated_at = now() WHERE id = $1`,
    [userId]
  );

  await db.query(
    `UPDATE tokens_refresh SET revoked_at = now() 
     WHERE user_id = $1 AND revoked_at IS NULL`,
    [userId]
  );

  return { message: "Cuenta eliminada correctamente" };
}