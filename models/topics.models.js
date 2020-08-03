const knex = require("../connection");

exports.fetchTopics = () => {
  return knex.select().from("topics");
};
