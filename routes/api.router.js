const apiRouter = require("express").Router();
const topicsRouter = require("./topics.router");
const usersRouter = require("./users.router");
const articlesRouter = require("./articles.router");
const commentsRouter = require("./comments.router");
const sendAPIs = require("../controllers/apis.controllers");

const { handle405s } = require("../errors");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

apiRouter.route("/").get(sendAPIs).all(handle405s);

module.exports = apiRouter;
