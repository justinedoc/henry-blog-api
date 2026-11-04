import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { UserController } from "../controllers/user.js";
import { authMiddleware } from "../middlewares/auth.js";
import { paginationQuerySchema, paginatedResponseSchema } from "../lib/pagination.js";
import type { AppBindings } from "../types.js";
import {
  createMessageSchema,
  dataResponseSchema,
  defaultErrorResponses,
  httpStatusCodes,
  jsonContent,
  jsonContentRequired,
} from "../lib/openapi.js";
import {
  updateProfileSchema,
  publicProfileSchema,
  userSummaryItemSchema,
  userAccountDetailsSchema,
  authorArticleItemSchema,
  listUsersQuerySchema,
} from "../validations/user.js";

export * from "../validations/user.js";

export const getUsersRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Users"],
  summary: "list users",
  request: {
    query: listUsersQuerySchema,
  },
  responses: {
    [httpStatusCodes.OK]: jsonContent(
      paginatedResponseSchema(userSummaryItemSchema, "users list"),
      "users list"
    ),
    ...defaultErrorResponses,
  },
});

export const getMeRoute = createRoute({
  method: "get",
  path: "/me",
  tags: ["Users"],
  summary: "get my profile",
  security: [{ BearerAuth: [] }],
  middleware: [authMiddleware],
  responses: {
    [httpStatusCodes.OK]: jsonContent(
      dataResponseSchema(userAccountDetailsSchema, "current user account"),
      "profile details"
    ),
    ...defaultErrorResponses,
  },
});

export const updateProfileRoute = createRoute({
  method: "patch",
  path: "/me",
  tags: ["Users"],
  summary: "update profile",
  security: [{ BearerAuth: [] }],
  middleware: [authMiddleware],
  request: {
    body: jsonContentRequired(updateProfileSchema, "profile data"),
  },
  responses: {
    [httpStatusCodes.OK]: jsonContent(
      dataResponseSchema(publicProfileSchema, "profile updated"),
      "profile updated"
    ),
    ...defaultErrorResponses,
  },
});

export const deleteAccountRoute = createRoute({
  method: "delete",
  path: "/me",
  tags: ["Users"],
  summary: "delete account",
  security: [{ BearerAuth: [] }],
  middleware: [authMiddleware],
  responses: {
    [httpStatusCodes.OK]: jsonContent(
      createMessageSchema("Account and profile deleted successfully", true),
      "account deleted"
    ),
    ...defaultErrorResponses,
  },
});

export const getUserArticlesRoute = createRoute({
  method: "get",
  path: "/{username}/articles",
  tags: ["Users"],
  summary: "get author articles",
  request: {
    params: z.object({
      username: z.string().openapi({
        param: { name: "username", in: "path" },
        description: "author username handle",
        example: "henryuche",
      }),
    }),
    query: paginationQuerySchema,
  },
  responses: {
    [httpStatusCodes.OK]: jsonContent(
      paginatedResponseSchema(authorArticleItemSchema, "author articles"),
      "author articles"
    ),
    ...defaultErrorResponses,
  },
});

export const getProfileRoute = createRoute({
  method: "get",
  path: "/{username}",
  tags: ["Users"],
  summary: "get user profile",
  request: {
    params: z.object({
      username: z.string().openapi({
        param: { name: "username", in: "path" },
        description: "author username handle",
        example: "henryuche",
      }),
    }),
  },
  responses: {
    [httpStatusCodes.OK]: jsonContent(
      dataResponseSchema(publicProfileSchema, "profile found"),
      "profile found"
    ),
    ...defaultErrorResponses,
  },
});

export type GetUsersRoute = typeof getUsersRoute;
export type GetMeRoute = typeof getMeRoute;
export type UpdateProfileRoute = typeof updateProfileRoute;
export type DeleteAccountRoute = typeof deleteAccountRoute;
export type GetUserArticlesRoute = typeof getUserArticlesRoute;
export type GetProfileRoute = typeof getProfileRoute;

export const userRouter = new OpenAPIHono<AppBindings>()
  .openapi(getUsersRoute, UserController.getUsers)
  .openapi(getMeRoute, UserController.getMe)
  .openapi(updateProfileRoute, UserController.updateProfile)
  .openapi(deleteAccountRoute, UserController.deleteAccount)
  .openapi(getUserArticlesRoute, UserController.getUserArticles)
  .openapi(getProfileRoute, UserController.getProfile);
