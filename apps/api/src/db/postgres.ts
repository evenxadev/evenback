import { Pool } from "pg";
import { env } from "../config/env";

export const db = new Pool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export async function testDatabaseConnection(): Promise<{ current_time: Date }> {
  const client = await db.connect();
  try {
    const result = await client.query<{ current_time: Date }>(
      "SELECT NOW() AS current_time"
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}