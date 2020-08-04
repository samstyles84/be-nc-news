const knex = require("../connection");

exports.fetchTopics = () => {
  return knex.select().from("topics");
};

exports.checkTopicExists = (topic) => {
  const topicQuery = knex.select().from("topics").returning("*");

  if (topic != "all") topicQuery.where("slug", topic);

  return topicQuery.then((topicRows) => {
    if (topicRows.length != 0) {
      return true;
    } else {
      return Promise.reject({
        status: 400,
        msg: "topic not found in db!!!",
      });
    }
  });
};
