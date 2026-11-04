import { z } from "@hono/zod-openapi";
import { paginationQuerySchema } from "../lib/pagination.js";

export const createArticleSchema = z.object({
  title: z.string().trim().min(3).max(200).openapi({
    description: "article title",
    example: "Mastering Backend Development with Node and SQLite",
  }),
  excerpt: z.string().trim().max(500).optional().openapi({
    description: "short preview or summary",
    example: "A practical guide to building clean RESTful APIs using Hono and Drizzle.",
  }),
  body: z.string().min(5).openapi({
    description: "full article content",
    example: "In this comprehensive guide, we explore building performant REST APIs with Hono, SQLite, and Drizzle ORM...",
  }),
});

export const updateArticleSchema = z.object({
  title: z.string().trim().min(3).max(200).optional().openapi({
    description: "updated title",
    example: "Mastering Backend Development with Node and SQLite (Second Edition)",
  }),
  excerpt: z.string().trim().max(500).optional().openapi({
    description: "updated excerpt",
    example: "An updated guide to SQLite with Hono and clean architecture.",
  }),
  body: z.string().min(5).optional().openapi({
    description: "updated body content",
    example: "Updated content covering SQLite indexes, cascade constraints, and testing...",
  }),
});

export const articleAuthorSchema = z.object({
  id: z.number().int().openapi({ description: "author account id", example: 1 }),
  email: z.email().openapi({ description: "author email", example: "uche.henry@example.com" }),
  username: z.string().nullable().openapi({ description: "author username handle", example: "henryuche" }),
  displayName: z.string().nullable().openapi({ description: "author display name", example: "Uche Chukwuma Henry" }),
  image: z.string().nullable().openapi({ description: "author avatar url", example: "https://example.com/henry.jpg" }),
});

export const articleItemSchema = z.object({
  id: z.string().openapi({ description: "article unique id", example: "art_12345678" }),
  title: z.string().openapi({ description: "article title", example: "Mastering Backend Development with Node and SQLite" }),
  slug: z.string().openapi({ description: "url-friendly slug", example: "mastering-backend-development-with-node-and-sqlite-h82b1" }),
  excerpt: z.string().nullable().openapi({ description: "article preview summary", example: "A practical guide to building clean RESTful APIs using Hono and Drizzle." }),
  body: z.string().openapi({ description: "article content", example: "In this comprehensive guide, we explore building performant REST APIs with Hono, SQLite, and Drizzle ORM..." }),
  createdAt: z.coerce.date().openapi({ description: "created timestamp", example: "2026-10-29T10:00:00.000Z" }),
  updatedAt: z.coerce.date().openapi({ description: "last updated timestamp", example: "2026-10-29T10:00:00.000Z" }),
  author: articleAuthorSchema,
});

export const myArticleItemSchema = z.object({
  id: z.string().openapi({ description: "article unique id", example: "art_12345678" }),
  title: z.string().openapi({ description: "article title", example: "Mastering Backend Development with Node and SQLite" }),
  slug: z.string().openapi({ description: "url-friendly slug", example: "mastering-backend-development-with-node-and-sqlite-h82b1" }),
  excerpt: z.string().nullable().openapi({ description: "article preview summary", example: "A practical guide to building clean RESTful APIs using Hono and Drizzle." }),
  body: z.string().openapi({ description: "article content", example: "In this comprehensive guide, we explore building performant REST APIs with Hono, SQLite, and Drizzle ORM..." }),
  createdAt: z.coerce.date().openapi({ description: "created timestamp", example: "2026-10-29T10:00:00.000Z" }),
  updatedAt: z.coerce.date().openapi({ description: "last updated timestamp", example: "2026-10-29T10:00:00.000Z" }),
});

export const articleRecordSchema = z.object({
  id: z.string().openapi({ description: "article unique id", example: "art_12345678" }),
  authorId: z.number().int().openapi({ description: "author account id", example: 1 }),
  title: z.string().openapi({ description: "article title", example: "Mastering Backend Development with Node and SQLite" }),
  slug: z.string().openapi({ description: "url slug", example: "mastering-backend-development-with-node-and-sqlite-h82b1" }),
  excerpt: z.string().nullable().openapi({ description: "preview excerpt", example: "A practical guide to building clean RESTful APIs using Hono and Drizzle." }),
  body: z.string().openapi({ description: "body text", example: "In this comprehensive guide, we explore building performant REST APIs with Hono, SQLite, and Drizzle ORM..." }),
  createdAt: z.coerce.date().openapi({ description: "created date", example: "2026-10-29T10:00:00.000Z" }),
  updatedAt: z.coerce.date().openapi({ description: "updated date", example: "2026-10-29T10:00:00.000Z" }),
});

export const listArticlesQuerySchema = paginationQuerySchema.extend({
  search: z.string().optional().openapi({
    param: { name: "search", in: "query" },
    description: "search filter by article title",
  }),
});
