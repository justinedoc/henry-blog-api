import { describe, it, expect, beforeAll } from "vitest";
import { ApiTestClient } from "./helpers/client.js";

describe("05 - Users, Profiles, and Cascade Deletion", () => {
  const client = new ApiTestClient();
  const timestamp = Date.now();
  const username = `cascade_user_${timestamp}`;
  const email = `cascade_${timestamp}@example.com`;

  let articleId = "";
  let commentId = "";

  beforeAll(async () => {
    // 1. Register user
    const regRes = await client.post("/api/auth/register", {
      email,
      password: "Password123!",
      username,
      displayName: "Cascade User",
    });
    client.setToken(regRes.body.data.token);

    // 2. Create article
    const artRes = await client.post("/api/articles", {
      title: "Cascade Test Article",
      excerpt: "To be deleted on account removal",
      body: "Body of the cascade test article.",
    });
    articleId = artRes.body.data.id;

    // 3. Post comment on own article
    const comRes = await client.post(`/api/articles/${articleId}/comments`, {
      body: "Self comment to test cascade delete.",
    });
    commentId = comRes.body.data.id;
  });

  it("should list registered users with pagination", async () => {
    const res = await client.get("/api/users?page=1&limit=10");
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.pagination.total).toBeGreaterThanOrEqual(1);
    expect(res.body.data.some((u: any) => u.username === username)).toBe(true);
  });

  it("should retrieve public profile by username", async () => {
    const res = await client.get(`/api/users/${username}`);
    expect(res.status).toBe(200);
    expect(res.body.data.username).toBe(username);
    expect(res.body.data.displayName).toBe("Cascade User");
  });

  it("should retrieve articles authored by username", async () => {
    const res = await client.get(`/api/users/${username}/articles?page=1&limit=5`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].id).toBe(articleId);
  });

  it("should delete user account", async () => {
    const res = await client.delete("/api/users/me");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain("Account and profile deleted successfully");
  });

  it("should verify profile is removed after account deletion", async () => {
    const res = await client.get(`/api/users/${username}`);
    expect(res.status).toBe(404);
  });

  it("should verify articles are cascaded and deleted", async () => {
    const res = await client.get(`/api/articles/${articleId}`);
    expect(res.status).toBe(404);
  });

  it("should verify comments are cascaded and deleted", async () => {
    const res = await client.get(`/api/comments/${commentId}`);
    expect(res.status).toBe(404);
  });
});
