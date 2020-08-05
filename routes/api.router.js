const apiRouter = require("express").Router();
const topicsRouter = require("./topics.router");
const usersRouter = require("./users.router");
const articlesRouter = require("./articles.router");

const { handle405s } = require("../errors");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);

apiRouter
  .route("/")
  .get(() => {
    console.log(
      "serves up a json representation of all the available endpoints of the api"
    );
  })
  .all(handle405s);

module.exports = apiRouter;
