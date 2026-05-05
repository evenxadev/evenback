"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const app_1 = require("../app");
(0, vitest_1.describe)("Health routes", () => {
    const app = (0, app_1.buildApp)();
    (0, vitest_1.afterAll)(async () => {
        await app.close();
    });
    (0, vitest_1.it)("GET / should return API message", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/",
        });
        (0, vitest_1.expect)(response.statusCode).toBe(200);
        (0, vitest_1.expect)(response.json()).toEqual({
            message: "Evenxa API running",
        });
    });
});
