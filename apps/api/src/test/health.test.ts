import { describe, it, expect, afterAll } from "vitest";
import { buildApp } from "../app";

describe("Health routes", () => {
  const app = buildApp();

  afterAll(async () => {
    await app.close();
  });

  it("GET / should return API message", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      message: "Evenxa API running",
    });
  });
});