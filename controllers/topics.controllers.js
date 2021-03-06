const { fetchTopics } = require("../models/topics.models");

const sendTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = sendTopics;
