const knex = require("../connection");

exports.fetchTopics = () => {
  return knex.select().from("topics");
};

exports.checkTopicExists = (topic) => {
  return knex
    .select()
    .from("topics")
    .returning("*")
    .modify((query) => {
      if (topic) query.where("slug", topic);
    })
    .then((topicRows) => {
      if (topicRows.length != 0) {
        return true;
      } else {
        return Promise.reject({
          status: 404,
          msg: "topic not found in db!!!",
        });
      }
    });
};
