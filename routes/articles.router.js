const articlesRouter = require("express").Router();
const {
  sendArticles,
  sendArticle,
  patchArticle,
} = require("../controllers/articles.controllers");

articlesRouter.route("/").get(sendArticles);
articlesRouter.route("/:article_id").get(sendArticle).patch(patchArticle);

module.exports = articlesRouter;
