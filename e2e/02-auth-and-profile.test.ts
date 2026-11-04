import { describe, it, expect } from "vitest";
import { ApiTestClient } from "./helpers/client.js";

describe("02 - Auth and Profile Management", () => {
  const client = new ApiTestClient();
  const timestamp = Date.now();
  const userCreds = {
    email: `henry_test_${timestamp}@example.com`,
    password: "Password123!",
    username: `henry_${timestamp}`,
    displayName: "Henry Test User",
  };

  let authToken = "";

  it("should successfully register a new author account", async () => {
    const res = await client.post("/api/auth/register", userCreds);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(userCreds.email);
    expect(res.body.data.user.username).toBe(userCreds.username);
  });

  it("should reject duplicate registration with same email", async () => {
    const res = await client.post("/api/auth/register", {
      ...userCreds,
      username: `different_${timestamp}`,
    });
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("should reject duplicate registration with same username", async () => {
    const res = await client.post("/api/auth/register", {
      ...userCreds,
      email: `different_${timestamp}@example.com`,
    });
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("should fail login with wrong password", async () => {
    const res = await client.post("/api/auth/login", {
      email: userCreds.email,
      password: "wrongpassword",
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should login successfully with valid credentials", async () => {
    const res = await client.post("/api/auth/login", {
      email: userCreds.email,
      password: userCreds.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    authToken = res.body.data.token;
    client.setToken(authToken);
  });

  it("should retrieve current authenticated user account", async () => {
    const res = await client.get("/api/auth/me");
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(userCreds.email);
    expect(res.body.data.profile.username).toBe(userCreds.username);
  });

  it("should reject access without token", async () => {
    const unauthClient = new ApiTestClient();
    const res = await unauthClient.get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("should update user profile details", async () => {
    const res = await client.patch("/api/users/me", {
      displayName: "Henry Updated",
      bio: "Updated biography for automated test.",
    });
    expect(res.status).toBe(200);
    expect(res.body.data.displayName).toBe("Henry Updated");
    expect(res.body.data.bio).toBe("Updated biography for automated test.");
  });

  it("should change account password", async () => {
    const res = await client.patch("/api/auth/change-password", {
      currentPassword: userCreds.password,
      newPassword: "NewSecretPassword456!",
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should fail login with old password after change", async () => {
    const res = await client.post("/api/auth/login", {
      email: userCreds.email,
      password: userCreds.password,
    });
    expect(res.status).toBe(401);
  });

  it("should succeed login with new password", async () => {
    const res = await client.post("/api/auth/login", {
      email: userCreds.email,
      password: "NewSecretPassword456!",
    });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });
});
