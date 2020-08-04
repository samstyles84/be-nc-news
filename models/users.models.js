const knex = require("../connection");

exports.fetchUser = (username) => {
  return knex.select().from("users").where({ username: username });
};
