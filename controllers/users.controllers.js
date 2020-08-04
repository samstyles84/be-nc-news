const { fetchUser } = require("../models/users.models");

const sendUser = (req, res, next) => {
  const username = req.params.username;
  fetchUser(username)
    .then((userArray) => {
      if (userArray.length === 0) {
        return Promise.reject({ status: 404, msg: "username not found" });
      } else {
        const user = userArray[0];
        res.send({ user });
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = sendUser;
