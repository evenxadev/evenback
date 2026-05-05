"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const fastify_1 = __importDefault(require("fastify"));
const postgres_1 = require("./db/postgres");
function buildApp() {
    const app = (0, fastify_1.default)({
        logger: true,
    });
    app.get("/", async () => {
        return {
            message: "Evenxa API running",
        };
    });
    app.get("/health/db", async () => {
        const database = await (0, postgres_1.testDatabaseConnection)();
        return {
            status: "ok",
            database,
        };
    });
    return app;
}
