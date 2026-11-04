import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { CommentController } from "../controllers/comment.js";
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
  createCommentSchema,
  updateCommentSchema,
  commentAuthorSchema,
  commentItemSchema,
  commentCreatedSchema,
  commentRecordSchema,
} from "../validations/comment.js";

export * from "../validations/comment.js";

export const createCommentRoute = createRoute({
  method: "post",
  path: "/articles/{articleId}/comments",
  tags: ["Comments"],
  summary: "create comment",
  security: [{ BearerAuth: [] }],
  middleware: [authMiddleware],
  request: {
    params: z.object({
      articleId: z.string().openapi({
        param: { name: "articleId", in: "path" },
        description: "article unique id",
        example: "art_12345678",
      }),
    }),
    body: jsonContentRequired(createCommentSchema, "comment data"),
  },
  responses: {
    [httpStatusCodes.CREATED]: jsonContent(
      dataResponseSchema(commentCreatedSchema, "comment created successfully"),
      "comment created"
    ),
    ...defaultErrorResponses,
  },
});

export const listCommentsRoute = createRoute({
  method: "get",
  path: "/articles/{articleId}/comments",
  tags: ["Comments"],
  summary: "list comments",
  request: {
    params: z.object({
      articleId: z.string().openapi({
        param: { name: "articleId", in: "path" },
        description: "article unique id",
        example: "art_12345678",
      }),
    }),
    query: paginationQuerySchema,
  },
  responses: {
    [httpStatusCodes.OK]: jsonContent(
      paginatedResponseSchema(commentItemSchema, "comments retrieved"),
      "comments list"
    ),
    ...defaultErrorResponses,
  },
});

export const getCommentByIdRoute = createRoute({
  method: "get",
  path: "/comments/{commentId}",
  tags: ["Comments"],
  summary: "get comment",
  request: {
    params: z.object({
      commentId: z.string().openapi({
        param: { name: "commentId", in: "path" },
        description: "comment unique id",
        example: "com_12345678",
      }),
    }),
  },
  responses: {
    [httpStatusCodes.OK]: jsonContent(
      dataResponseSchema(commentItemSchema, "comment retrieved"),
      "comment details"
    ),
    ...defaultErrorResponses,
  },
});

export const updateCommentRoute = createRoute({
  method: "patch",
  path: "/comments/{commentId}",
  tags: ["Comments"],
  summary: "update comment",
  security: [{ BearerAuth: [] }],
  middleware: [authMiddleware],
  request: {
    params: z.object({
      commentId: z.string().openapi({
        param: { name: "commentId", in: "path" },
        description: "comment unique id",
        example: "com_12345678",
      }),
    }),
    body: jsonContentRequired(updateCommentSchema, "comment update data"),
  },
  responses: {
    [httpStatusCodes.OK]: jsonContent(
      dataResponseSchema(commentRecordSchema, "comment updated successfully"),
      "comment updated"
    ),
    ...defaultErrorResponses,
  },
});

export const deleteCommentRoute = createRoute({
  method: "delete",
  path: "/comments/{commentId}",
  tags: ["Comments"],
  summary: "delete comment",
  security: [{ BearerAuth: [] }],
  middleware: [authMiddleware],
  request: {
    params: z.object({
      commentId: z.string().openapi({
        param: { name: "commentId", in: "path" },
        description: "comment unique id",
        example: "com_12345678",
      }),
    }),
  },
  responses: {
    [httpStatusCodes.OK]: jsonContent(
      createMessageSchema("Comment deleted successfully", true),
      "comment deleted"
    ),
    ...defaultErrorResponses,
  },
});

export type CreateCommentRoute = typeof createCommentRoute;
export type ListCommentsRoute = typeof listCommentsRoute;
export type GetCommentByIdRoute = typeof getCommentByIdRoute;
export type UpdateCommentRoute = typeof updateCommentRoute;
export type DeleteCommentRoute = typeof deleteCommentRoute;

export const commentRouter = new OpenAPIHono<AppBindings>()
  .openapi(createCommentRoute, CommentController.createComment)
  .openapi(listCommentsRoute, CommentController.getComments)
  .openapi(getCommentByIdRoute, CommentController.getCommentById)
  .openapi(updateCommentRoute, CommentController.updateComment)
  .openapi(deleteCommentRoute, CommentController.deleteComment);
