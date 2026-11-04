import { describe, it, expect, beforeAll } from "vitest";
import { ApiTestClient } from "./helpers/client.js";

describe("03 - Article Management", () => {
  const authorClient = new ApiTestClient();
  const strangerClient = new ApiTestClient();
  const timestamp = Date.now();

  let articleId = "";
  let articleSlug = "";

  beforeAll(async () => {
    // Register primary author
    const authorRes = await authorClient.post("/api/auth/register", {
      email: `author_${timestamp}@example.com`,
      password: "Password123!",
      username: `author_${timestamp}`,
      displayName: "Author Henry",
    });
    authorClient.setToken(authorRes.body.data.token);

    // Register second user
    const strangerRes = await strangerClient.post("/api/auth/register", {
      email: `stranger_${timestamp}@example.com`,
      password: "Password123!",
      username: `stranger_${timestamp}`,
      displayName: "Stranger Henry",
    });
    strangerClient.setToken(strangerRes.body.data.token);
  });

  it("should create an article with auto-generated slug", async () => {
    const res = await authorClient.post("/api/articles", {
      title: "Comprehensive Guide to SQLite with Node",
      excerpt: "Learn how to use SQLite without heavy external daemons.",
      body: "SQLite is an embedded relational database engine...",
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.slug).toContain("comprehensive-guide-to-sqlite-with-node");
    articleId = res.body.data.id;
    articleSlug = res.body.data.slug;
  });

  it("should retrieve article by ID", async () => {
    const res = await authorClient.get(`/api/articles/${articleId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(articleId);
    expect(res.body.data.author.username).toBe(`author_${timestamp}`);
  });

  it("should retrieve article by slug", async () => {
    const res = await authorClient.get(`/api/articles/${articleSlug}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(articleId);
  });

  it("should list articles with pagination metadata", async () => {
    const res = await authorClient.get("/api/articles?page=1&limit=5");
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.pagination).toMatchObject({
      page: 1,
      limit: 5,
    });
  });

  it("should search articles by title keyword", async () => {
    const res = await authorClient.get("/api/articles?search=SQLite");
    expect(res.status).toBe(200);
    expect(res.body.data.some((a: any) => a.id === articleId)).toBe(true);
  });

  it("should retrieve 'my articles' for authenticated author", async () => {
    const res = await authorClient.get("/api/articles/me?page=1&limit=10");
    expect(res.status).toBe(200);
    expect(res.body.data.some((a: any) => a.id === articleId)).toBe(true);
  });

  it("should prevent a non-author from updating the article", async () => {
    const res = await strangerClient.patch(`/api/articles/${articleId}`, {
      title: "Hacked Title",
    });
    expect(res.status).toBe(403);
  });

  it("should update article title and regenerate slug", async () => {
    const res = await authorClient.patch(`/api/articles/${articleId}`, {
      title: "Advanced Guide to SQLite with Node",
      excerpt: "Updated summary text.",
    });
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe("Advanced Guide to SQLite with Node");
    expect(res.body.data.slug).toContain("advanced-guide-to-sqlite-with-node");
  });

  it("should prevent a non-author from deleting the article", async () => {
    const res = await strangerClient.delete(`/api/articles/${articleId}`);
    expect(res.status).toBe(403);
  });

  it("should delete the article by author", async () => {
    const res = await authorClient.delete(`/api/articles/${articleId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const lookupRes = await authorClient.get(`/api/articles/${articleId}`);
    expect(lookupRes.status).toBe(404);
  });
});
