import { z } from "@hono/zod-openapi";

export const registerSchema = z.object({
  email: z.email().openapi({
    description: "user email address",
    example: "uche.henry@example.com",
  }),
  password: z.string().min(6).openapi({
    description: "account password (minimum 6 characters)",
    example: "secret123",
  }),
  username: z.string().min(3).max(30).openapi({
    description: "unique author username",
    example: "henryuche",
  }),
  displayName: z.string().optional().openapi({
    description: "public display name",
    example: "Uche Chukwuma Henry",
  }),
});

export const loginSchema = z.object({
  email: z.email().openapi({
    description: "registered email address",
    example: "uche.henry@example.com",
  }),
  password: z.string().min(6).openapi({
    description: "account password",
    example: "secret123",
  }),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6).openapi({
    description: "current account password",
    example: "secret123",
  }),
  newPassword: z.string().min(6).openapi({
    description: "new account password",
    example: "newSecret456",
  }),
});

export const authResponseDataSchema = z.object({
  token: z.string().openapi({
    description: "jwt bearer access token",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  }),
  user: z.object({
    id: z.number().int().openapi({ description: "account user id", example: 1 }),
    email: z.email().openapi({ description: "user email", example: "uche.henry@example.com" }),
    username: z.string().nullable().openapi({ description: "author username", example: "henryuche" }),
    displayName: z.string().nullable().openapi({ description: "public display name", example: "Uche Chukwuma Henry" }),
    image: z.string().nullable().optional().openapi({ description: "avatar url", example: "https://example.com/henry.jpg" }),
  }).openapi({ description: "authenticated user summary" }),
});

export const userProfileDataSchema = z.object({
  id: z.string().openapi({ description: "profile id", example: "prof_12345678" }),
  userId: z.number().int().openapi({ description: "account user id", example: 1 }),
  username: z.string().openapi({ description: "unique username handle", example: "henryuche" }),
  displayName: z.string().nullable().openapi({ description: "display name", example: "Uche Chukwuma Henry" }),
  bio: z.string().nullable().openapi({ description: "author biography", example: "Backend developer and tech enthusiast." }),
  image: z.string().nullable().openapi({ description: "profile avatar image url", example: "https://example.com/henry.jpg" }),
  createdAt: z.coerce.date().openapi({ description: "profile creation timestamp", example: "2026-10-29T10:00:00.000Z" }),
  updatedAt: z.coerce.date().openapi({ description: "profile last updated timestamp", example: "2026-10-29T10:00:00.000Z" }),
});

export const userAccountDetailsSchema = z.object({
  id: z.number().int().openapi({ description: "user account id", example: 1 }),
  email: z.email().openapi({ description: "email address", example: "uche.henry@example.com" }),
  profile: userProfileDataSchema.nullable().openapi({ description: "user profile info" }),
  createdAt: z.coerce.date().openapi({ description: "account creation timestamp", example: "2026-10-29T10:00:00.000Z" }),
});
