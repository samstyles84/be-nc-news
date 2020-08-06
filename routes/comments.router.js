const commentsRouter = require("express").Router();
const {
  patchComment,
  deleteComment,
} = require("../controllers/comments.controllers");

const { handle405s } = require("../errors");

commentsRouter
  .route("/:comment_id")
  .patch(patchComment)
  .delete(deleteComment)
  .all(handle405s);

module.exports = commentsRouter;
