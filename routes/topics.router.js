const topicsRouter = require("express").Router();
const sendTopics = require("../controllers/topics.controllers");

topicsRouter.route("/").get(sendTopics);

module.exports = topicsRouter;
