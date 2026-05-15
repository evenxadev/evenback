import { Pool } from "pg";
import { env } from "../config/env";

const isProduction = env.nodeEnv === "production";

export const db = new Pool({
  host: isProduction
    ? `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`
    : env.db.host,
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
      "SELECT NOW() AS current_time, current_database() as db, current_user as usr"
    );
    console.log("BD info:", result.rows[0]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

db.query(`
  SELECT 
    current_database() as database,
    current_schema() as schema,
    current_user as user,
    inet_server_addr() as host,
    inet_server_port() as port
`).then((res) => {
  console.log("DB conectada:", res.rows[0]);
});