const articlesRouter = require("express").Router();
const {
  sendArticles,
  sendArticle,
} = require("../controllers/articles.controllers");

articlesRouter.route("/").get(sendArticles);
articlesRouter.route("/:article_id").get(sendArticle);

module.exports = articlesRouter;
