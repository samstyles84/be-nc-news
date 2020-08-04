const usersRouter = require("express").Router();
const sendUser = require("../controllers/users.controllers");

usersRouter.route("/:username").get(sendUser);

module.exports = usersRouter;
