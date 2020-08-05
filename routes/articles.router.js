const articlesRouter = require("express").Router();
const {
  sendArticles,
  sendArticle,
  patchArticle,
} = require("../controllers/articles.controllers");

const {
  postComment,
  sendComments,
} = require("../controllers/comments.controllers");

const { handle405s } = require("../errors");

articlesRouter.route("/").get(sendArticles).all(handle405s);
articlesRouter
  .route("/:article_id")
  .get(sendArticle)
  .patch(patchArticle)
  .all(handle405s);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(sendComments)
  .all(handle405s);

module.exports = articlesRouter;
