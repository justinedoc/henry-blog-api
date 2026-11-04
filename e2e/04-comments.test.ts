import { describe, it, expect, beforeAll } from "vitest";
import { ApiTestClient } from "./helpers/client.js";

describe("04 - Comments Management", () => {
  const authorClient = new ApiTestClient();
  const readerClient = new ApiTestClient();
  const timestamp = Date.now();

  let articleId = "";
  let commentId = "";

  beforeAll(async () => {
    // Register author and reader
    const authorRes = await authorClient.post("/api/auth/register", {
      email: `comment_author_${timestamp}@example.com`,
      password: "Password123!",
      username: `c_author_${timestamp}`,
      displayName: "Article Author",
    });
    authorClient.setToken(authorRes.body.data.token);

    const readerRes = await readerClient.post("/api/auth/register", {
      email: `comment_reader_${timestamp}@example.com`,
      password: "Password123!",
      username: `c_reader_${timestamp}`,
      displayName: "Article Reader",
    });
    readerClient.setToken(readerRes.body.data.token);

    // Create article to comment on
    const articleRes = await authorClient.post("/api/articles", {
      title: "Understanding Comment Cascades",
      body: "Discussion about database referential integrity...",
    });
    articleId = articleRes.body.data.id;
  });

  it("should post a comment on an article", async () => {
    const res = await readerClient.post(`/api/articles/${articleId}/comments`, {
      body: "Great explanation! Really enjoyed the breakdown of foreign keys.",
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.articleId).toBe(articleId);
    expect(res.body.data.author.username).toBe(`c_reader_${timestamp}`);
    commentId = res.body.data.id;
  });

  it("should list comments for the article with pagination", async () => {
    const res = await authorClient.get(`/api/articles/${articleId}/comments?page=1&limit=5`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.pagination.total).toBeGreaterThanOrEqual(1);
    expect(res.body.data.some((c: any) => c.id === commentId)).toBe(true);
  });

  it("should retrieve single comment by comment ID", async () => {
    const res = await authorClient.get(`/api/comments/${commentId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(commentId);
    expect(res.body.data.body).toContain("Great explanation");
  });

  it("should prevent non-author from editing the comment", async () => {
    const res = await authorClient.patch(`/api/comments/${commentId}`, {
      body: "Tampered comment body",
    });
    expect(res.status).toBe(403);
  });

  it("should allow author to update comment body", async () => {
    const res = await readerClient.patch(`/api/comments/${commentId}`, {
      body: "Updated comment: Excellent walkthrough on SQLite!",
    });
    expect(res.status).toBe(200);
    expect(res.body.data.body).toBe("Updated comment: Excellent walkthrough on SQLite!");
  });

  it("should prevent non-author from deleting comment", async () => {
    const res = await authorClient.delete(`/api/comments/${commentId}`);
    expect(res.status).toBe(403);
  });

  it("should allow author to delete comment", async () => {
    const res = await readerClient.delete(`/api/comments/${commentId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const lookupRes = await readerClient.get(`/api/comments/${commentId}`);
    expect(lookupRes.status).toBe(404);
  });
});
