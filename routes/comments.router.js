const commentsRouter = require("express").Router();
const { patchComment } = require("../controllers/comments.controllers");

const { handle405s } = require("../errors");

commentsRouter.route("/:comment_id").patch(patchComment).all(handle405s);

module.exports = commentsRouter;
