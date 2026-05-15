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