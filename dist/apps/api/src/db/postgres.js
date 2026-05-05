"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.testDatabaseConnection = testDatabaseConnection;
const pg_1 = require("pg");
const env_1 = require("../config/env");
exports.db = new pg_1.Pool({
    host: env_1.env.db.host,
    port: env_1.env.db.port,
    user: env_1.env.db.user,
    password: env_1.env.db.password,
    database: env_1.env.db.database,
});
async function testDatabaseConnection() {
    const result = await exports.db.query("SELECT NOW() AS current_time");
    return result.rows[0];
}
