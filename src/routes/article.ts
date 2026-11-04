import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { ArticleController } from "../controllers/article.js";
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
  createArticleSchema,
  updateArticleSchema,
  articleAuthorSchema,
  articleItemSchema,
  myArticleItemSchema,
  articleRecordSchema,
  listArticlesQuerySchema,
} from "../validations/article.js";

export * from "../validations/article.js";

export const getMyArticlesRoute = createRoute({
  method: "get",
  path: "/me",
  tags: ["Articles"],
  summary: "get my articles",
  security: [{ BearerAuth: [] }],
  middleware: [authMiddleware],
  request: {
    query: paginationQuerySchema,
  },
  responses: {
    [httpStatusCodes.OK]: jsonContent(
      paginatedResponseSchema(myArticleItemSchema, "my articles retrieved"),
      "my articles"
    ),
    ...defaultErrorResponses,
  },
});

export const createArticleRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Articles"],
  summary: "create article",
  security: [{ BearerAuth: [] }],
  middleware: [authMiddleware],
  request: {
    body: jsonContentRequired(createArticleSchema, "article creation data"),
  },
  responses: {
    [httpStatusCodes.CREATED]: jsonContent(
      dataResponseSchema(articleRecordSchema, "article created successfully"),
      "article created"
    ),
    ...defaultErrorResponses,
  },
});

export const listArticlesRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Articles"],
  summary: "list articles",
  request: {
    query: listArticlesQuerySchema,
  },
  responses: {
    [httpStatusCodes.OK]: jsonContent(
      paginatedResponseSchema(articleItemSchema, "articles retrieved"),
      "articles list"
    ),
    ...defaultErrorResponses,
  },
});

export const getArticleRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Articles"],
  summary: "get article",
  request: {
    params: z.object({
      id: z.string().openapi({
        param: { name: "id", in: "path" },
        description: "article unique id or slug",
        example: "mastering-backend-development-with-node-and-sqlite-h82b1",
      }),
    }),
  },
  responses: {
    [httpStatusCodes.OK]: jsonContent(
      dataResponseSchema(articleItemSchema, "article retrieved"),
      "article details"
    ),
    ...defaultErrorResponses,
  },
});

export const updateArticleRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags: ["Articles"],
  summary: "update article",
  security: [{ BearerAuth: [] }],
  middleware: [authMiddleware],
  request: {
    params: z.object({
      id: z.string().openapi({
        param: { name: "id", in: "path" },
        description: "article unique id",
        example: "art_12345678",
      }),
    }),
    body: jsonContentRequired(updateArticleSchema, "article update data"),
  },
  responses: {
    [httpStatusCodes.OK]: jsonContent(
      dataResponseSchema(articleRecordSchema, "article updated successfully"),
      "article updated"
    ),
    ...defaultErrorResponses,
  },
});

export const deleteArticleRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Articles"],
  summary: "delete article",
  security: [{ BearerAuth: [] }],
  middleware: [authMiddleware],
  request: {
    params: z.object({
      id: z.string().openapi({
        param: { name: "id", in: "path" },
        description: "article unique id",
        example: "art_12345678",
      }),
    }),
  },
  responses: {
    [httpStatusCodes.OK]: jsonContent(
      createMessageSchema("Article deleted successfully", true),
      "article deleted"
    ),
    ...defaultErrorResponses,
  },
});

export type GetMyArticlesRoute = typeof getMyArticlesRoute;
export type CreateArticleRoute = typeof createArticleRoute;
export type ListArticlesRoute = typeof listArticlesRoute;
export type GetArticleRoute = typeof getArticleRoute;
export type UpdateArticleRoute = typeof updateArticleRoute;
export type DeleteArticleRoute = typeof deleteArticleRoute;

export const articleRouter = new OpenAPIHono<AppBindings>()
  .openapi(getMyArticlesRoute, ArticleController.getMyArticles)
  .openapi(createArticleRoute, ArticleController.createArticle)
  .openapi(listArticlesRoute, ArticleController.getArticles)
  .openapi(getArticleRoute, ArticleController.getArticleById)
  .openapi(updateArticleRoute, ArticleController.updateArticle)
  .openapi(deleteArticleRoute, ArticleController.deleteArticle);
