import { describe, it, expect } from "vitest";
import { ApiTestClient } from "./helpers/client.js";

describe("01 - System & Documentation Endpoints", () => {
  const client = new ApiTestClient();

  it("should serve OpenAPI 3.1.0 specification at /api/doc", async () => {
    const res = await client.get("/api/doc");
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.openapi).toBe("3.1.0");
    expect(res.body.info.title).toContain("Henry Article API");
    expect(res.body.paths).toBeDefined();
    expect(res.body.paths["/api/auth/register"]).toBeDefined();
    expect(res.body.paths["/api/articles"]).toBeDefined();
  });

  it("should serve Scalar UI documentation at /api/reference", async () => {
    const res = await client.get("/api/reference");
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe("string");
    expect(res.body).toContain("html");
  });

  it("should return structured 404 error for unknown routes", async () => {
    const res = await client.get("/api/unknown-endpoint");
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({
      success: false,
      message: expect.stringContaining("Route not found"),
    });
  });
});
