import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { AuthController } from "../controllers/auth.js";
import { authMiddleware } from "../middlewares/auth.js";
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
  registerSchema,
  loginSchema,
  changePasswordSchema,
  authResponseDataSchema,
  userAccountDetailsSchema,
} from "../validations/auth.js";

export * from "../validations/auth.js";

export const registerRoute = createRoute({
  method: "post",
  path: "/register",
  tags: ["Auth"],
  summary: "register user",
  request: {
    body: jsonContentRequired(registerSchema, "registration data"),
  },
  responses: {
    [httpStatusCodes.CREATED]: jsonContent(
      dataResponseSchema(authResponseDataSchema, "user registered"),
      "user registered"
    ),
    ...defaultErrorResponses,
  },
});

export const loginRoute = createRoute({
  method: "post",
  path: "/login",
  tags: ["Auth"],
  summary: "login user",
  request: {
    body: jsonContentRequired(loginSchema, "login data"),
  },
  responses: {
    [httpStatusCodes.OK]: jsonContent(
      dataResponseSchema(authResponseDataSchema, "logged in"),
      "logged in"
    ),
    ...defaultErrorResponses,
  },
});

export const meRoute = createRoute({
  method: "get",
  path: "/me",
  tags: ["Auth"],
  summary: "get current user",
  security: [{ BearerAuth: [] }],
  middleware: [authMiddleware],
  responses: {
    [httpStatusCodes.OK]: jsonContent(
      dataResponseSchema(userAccountDetailsSchema, "current user details"),
      "current user"
    ),
    ...defaultErrorResponses,
  },
});

export const changePasswordRoute = createRoute({
  method: "patch",
  path: "/change-password",
  tags: ["Auth"],
  summary: "change password",
  security: [{ BearerAuth: [] }],
  middleware: [authMiddleware],
  request: {
    body: jsonContentRequired(changePasswordSchema, "password data"),
  },
  responses: {
    [httpStatusCodes.OK]: jsonContent(
      createMessageSchema("Password updated successfully", true),
      "password updated"
    ),
    ...defaultErrorResponses,
  },
});

export type RegisterRoute = typeof registerRoute;
export type LoginRoute = typeof loginRoute;
export type MeRoute = typeof meRoute;
export type ChangePasswordRoute = typeof changePasswordRoute;

export const authRouter = new OpenAPIHono<AppBindings>()
  .openapi(registerRoute, AuthController.register)
  .openapi(loginRoute, AuthController.login)
  .openapi(meRoute, AuthController.getMe)
  .openapi(changePasswordRoute, AuthController.changePassword);
