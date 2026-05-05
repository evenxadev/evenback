import { Pool } from "pg";
import { env } from "../config/env";

export const db = new Pool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
});

export async function testDatabaseConnection() {
  const result = await db.query("SELECT NOW() AS current_time");
  return result.rows[0];
}