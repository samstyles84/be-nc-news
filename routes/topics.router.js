const topicsRouter = require("express").Router();
const sendTopics = require("../controllers/topics.controllers");

const { handle405s } = require("../errors");

topicsRouter.route("/").get(sendTopics).all(handle405s);

module.exports = topicsRouter;
