const articlesRouter = require("express").Router();
const sendArticles = require("../controllers/articles.controllers");

articlesRouter.route("/").get(sendArticles);

module.exports = articlesRouter;
