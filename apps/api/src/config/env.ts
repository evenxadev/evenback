import dotenv from "dotenv";

dotenv.config();

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const env = {
  port: Number(optional("PORT", "3000")),
  nodeEnv: optional("NODE_ENV", "development"),
  jwtSecret: optional("JWT_SECRET", "dev-secret-cambiar-en-produccion"),

  db: {
    host: optional("DB_HOST", "localhost"),
    port: Number(optional("DB_PORT", "5432")),
    user: optional("DB_USER", "postgres"),
    password: optional("DB_PASSWORD", ""),
    database: optional("DB_NAME", "evenxa_db"),
  },
};