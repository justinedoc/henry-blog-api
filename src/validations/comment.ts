import { z } from "@hono/zod-openapi";

export const createCommentSchema = z.object({
  body: z.string().trim().min(1).max(1000).openapi({
    description: "comment body text",
    example: "Excellent walkthrough, the explanation of database indexes was very helpful.",
  }),
});

export const updateCommentSchema = z.object({
  body: z.string().trim().min(1).max(1000).openapi({
    description: "updated comment text",
    example: "Updated comment text with more context and practical tips.",
  }),
});

export const commentAuthorSchema = z.object({
  id: z.number().int().openapi({ description: "author account id", example: 1 }),
  email: z.email().nullable().optional().openapi({ description: "author email", example: "uche.henry@example.com" }),
  username: z.string().nullable().openapi({ description: "author username handle", example: "henryuche" }),
  displayName: z.string().nullable().openapi({ description: "author display name", example: "Uche Chukwuma Henry" }),
  image: z.string().nullable().openapi({ description: "author avatar url", example: "https://example.com/henry.jpg" }),
});

export const commentItemSchema = z.object({
  id: z.string().openapi({ description: "comment unique id", example: "com_12345678" }),
  articleId: z.string().openapi({ description: "target article id", example: "art_12345678" }),
  body: z.string().openapi({ description: "comment body content", example: "Excellent walkthrough, the explanation of database indexes was very helpful." }),
  createdAt: z.coerce.date().openapi({ description: "comment creation date", example: "2026-10-29T10:00:00.000Z" }),
  updatedAt: z.coerce.date().openapi({ description: "comment updated date", example: "2026-10-29T10:00:00.000Z" }),
  author: commentAuthorSchema,
});

export const commentCreatedSchema = z.object({
  id: z.string().openapi({ description: "comment unique id", example: "com_12345678" }),
  articleId: z.string().openapi({ description: "target article id", example: "art_12345678" }),
  body: z.string().openapi({ description: "comment body text", example: "Excellent walkthrough, the explanation of database indexes was very helpful." }),
  createdAt: z.coerce.date().openapi({ description: "creation timestamp", example: "2026-10-29T10:00:00.000Z" }),
  updatedAt: z.coerce.date().openapi({ description: "updated timestamp", example: "2026-10-29T10:00:00.000Z" }),
  author: z.object({
    id: z.number().int().openapi({ description: "author user id", example: 1 }),
    username: z.string().nullable().openapi({ description: "author username", example: "henryuche" }),
    displayName: z.string().nullable().openapi({ description: "author display name", example: "Uche Chukwuma Henry" }),
    image: z.string().nullable().openapi({ description: "avatar url", example: "https://example.com/henry.jpg" }),
  }),
});

export const commentRecordSchema = z.object({
  id: z.string().openapi({ description: "comment unique id", example: "com_12345678" }),
  articleId: z.string().openapi({ description: "target article id", example: "art_12345678" }),
  authorId: z.number().int().openapi({ description: "author user id", example: 1 }),
  body: z.string().openapi({ description: "comment content", example: "Updated comment text with more context and practical tips." }),
  createdAt: z.coerce.date().openapi({ description: "creation timestamp", example: "2026-10-29T10:00:00.000Z" }),
  updatedAt: z.coerce.date().openapi({ description: "updated timestamp", example: "2026-10-29T10:00:00.000Z" }),
});
