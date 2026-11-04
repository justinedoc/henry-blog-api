import { z } from "@hono/zod-openapi";
import { paginationQuerySchema } from "../lib/pagination.js";

export const updateProfileSchema = z.object({
  displayName: z.string().min(2).max(50).optional().openapi({
    description: "public display name",
    example: "Uche Chukwuma Henry",
  }),
  bio: z.string().max(500).optional().nullable().openapi({
    description: "biography or about me text",
    example: "Backend developer and tech enthusiast passionate about Node.js and scalable APIs.",
  }),
  image: z.string().url().optional().nullable().openapi({
    description: "avatar image url",
    example: "https://example.com/henry.jpg",
  }),
  username: z.string().min(3).max(30).optional().openapi({
    description: "unique handle",
    example: "henryuche",
  }),
});

export const publicProfileSchema = z.object({
  id: z.string().openapi({ description: "profile unique id", example: "prof_12345678" }),
  userId: z.number().int().openapi({ description: "account user id", example: 1 }),
  username: z.string().openapi({ description: "unique username handle", example: "henryuche" }),
  displayName: z.string().nullable().openapi({ description: "public display name", example: "Uche Chukwuma Henry" }),
  bio: z.string().nullable().openapi({ description: "author bio", example: "Backend developer and tech enthusiast passionate about Node.js and scalable APIs." }),
  image: z.string().nullable().openapi({ description: "avatar image url", example: "https://example.com/henry.jpg" }),
  createdAt: z.coerce.date().openapi({ description: "profile creation date", example: "2026-10-29T10:00:00.000Z" }),
  updatedAt: z.coerce.date().openapi({ description: "profile updated date", example: "2026-10-29T10:00:00.000Z" }),
});

export const userSummaryItemSchema = z.object({
  id: z.string().openapi({ description: "profile id", example: "prof_12345678" }),
  userId: z.number().int().openapi({ description: "account user id", example: 1 }),
  username: z.string().openapi({ description: "username", example: "henryuche" }),
  displayName: z.string().nullable().openapi({ description: "display name", example: "Uche Chukwuma Henry" }),
  bio: z.string().nullable().openapi({ description: "bio", example: "Backend developer and tech enthusiast passionate about Node.js and scalable APIs." }),
  image: z.string().nullable().openapi({ description: "avatar url", example: "https://example.com/henry.jpg" }),
  createdAt: z.coerce.date().openapi({ description: "created date", example: "2026-10-29T10:00:00.000Z" }),
});

export const userAccountDetailsSchema = z.object({
  id: z.number().int().openapi({ description: "account id", example: 1 }),
  email: z.email().openapi({ description: "email address", example: "uche.henry@example.com" }),
  profile: publicProfileSchema.nullable().openapi({ description: "profile information" }),
  createdAt: z.coerce.date().openapi({ description: "account creation date", example: "2026-10-29T10:00:00.000Z" }),
});

export const authorArticleItemSchema = z.object({
  id: z.string().openapi({ description: "article id", example: "art_12345678" }),
  title: z.string().openapi({ description: "article title", example: "Mastering Backend Development with Node and SQLite" }),
  slug: z.string().openapi({ description: "url slug", example: "mastering-backend-development-with-node-and-sqlite-h82b1" }),
  excerpt: z.string().nullable().openapi({ description: "short summary", example: "A practical guide to building clean RESTful APIs using Hono and Drizzle." }),
  body: z.string().openapi({ description: "article content", example: "Full article body content..." }),
  createdAt: z.coerce.date().openapi({ description: "creation date", example: "2026-10-29T10:00:00.000Z" }),
  updatedAt: z.coerce.date().openapi({ description: "updated date", example: "2026-10-29T10:00:00.000Z" }),
  author: z.object({
    id: z.number().int().openapi({ description: "author id", example: 1 }),
    username: z.string().openapi({ description: "author username", example: "henryuche" }),
    displayName: z.string().nullable().openapi({ description: "display name", example: "Uche Chukwuma Henry" }),
    image: z.string().nullable().openapi({ description: "avatar url", example: "https://example.com/henry.jpg" }),
  }),
});

export const listUsersQuerySchema = paginationQuerySchema.extend({
  search: z.string().optional().openapi({
    param: { name: "search", in: "query" },
    description: "search username",
  }),
});
