const apiRouter = require("express").Router();
const topicsRouter = require("./topics.router");
const usersRouter = require("./users.router");
const articlesRouter = require("./articles.router");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);

apiRouter.get("/", () => {
  console.log(
    "serves up a json representation of all the available endpoints of the api"
  );
});

module.exports = apiRouter;
