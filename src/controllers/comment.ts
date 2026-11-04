import type { AppRouteHandler } from "../types.js";
import type {
  CreateCommentRoute,
  ListCommentsRoute,
  GetCommentByIdRoute,
  UpdateCommentRoute,
  DeleteCommentRoute,
} from "../routes/comment.js";
import { CommentService } from "../services/comment.js";
import { getAuthUser } from "../middlewares/auth.js";
import { httpStatusCodes } from "../lib/openapi.js";

export class CommentController {
  static createComment: AppRouteHandler<CreateCommentRoute> = async (c) => {
    const user = getAuthUser(c);
    const { articleId } = c.req.valid("param");
    const { body } = c.req.valid("json");
    const result = await CommentService.createComment(articleId, user.id, body);
    return c.json(
      {
        success: true,
        message: "Comment added successfully",
        data: result,
      },
      httpStatusCodes.CREATED
    );
  };

  static getComments: AppRouteHandler<ListCommentsRoute> = async (c) => {
    const { articleId } = c.req.valid("param");
    const { page, limit } = c.req.valid("query");
    const result = await CommentService.getCommentsByArticle(articleId, { page, limit });
    return c.json(result, httpStatusCodes.OK);
  };

  static getCommentById: AppRouteHandler<GetCommentByIdRoute> = async (c) => {
    const { commentId } = c.req.valid("param");
    const result = await CommentService.getCommentById(commentId);
    return c.json(
      {
        success: true,
        message: "Comment retrieved successfully",
        data: result,
      },
      httpStatusCodes.OK
    );
  };

  static updateComment: AppRouteHandler<UpdateCommentRoute> = async (c) => {
    const user = getAuthUser(c);
    const { commentId } = c.req.valid("param");
    const { body } = c.req.valid("json");
    const result = await CommentService.updateComment(commentId, user.id, body);
    return c.json(
      {
        success: true,
        message: "Comment updated successfully",
        data: result,
      },
      httpStatusCodes.OK
    );
  };

  static deleteComment: AppRouteHandler<DeleteCommentRoute> = async (c) => {
    const user = getAuthUser(c);
    const { commentId } = c.req.valid("param");
    const result = await CommentService.deleteComment(commentId, user.id);
    return c.json(result, httpStatusCodes.OK);
  };
}
