import { OpenAPIHono } from "@hono/zod-openapi";
import { authRouter } from "./auth.js";
import { userRouter } from "./user.js";
import { articleRouter } from "./article.js";
import { commentRouter } from "./comment.js";
import type { AppBindings } from "../types.js";

export const routes = new OpenAPIHono<AppBindings>()
  .route("/auth", authRouter)
  .route("/users", userRouter)
  .route("/articles", articleRouter)
  .route("/", commentRouter);
