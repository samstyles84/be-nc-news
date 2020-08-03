const apiRouter = require("express").Router();
const topicsRouter = require("./topics.router");

apiRouter.use("/topics", topicsRouter);

apiRouter.get("/", () => {
  console.log(
    "serves up a json representation of all the available endpoints of the api"
  );
});

module.exports = apiRouter;
