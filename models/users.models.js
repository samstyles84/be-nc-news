const knex = require("../connection");

exports.fetchUser = (username) => {
  return knex.select().from("users").where({ username: username });
};

exports.checkUserExists = (user) => {
  const userQuery = knex.select().from("users").returning("*");

  if (user != "all") userQuery.where("username", user);

  return userQuery.then((userRows) => {
    if (userRows.length != 0) {
      return true;
    } else {
      return Promise.reject({
        status: 400,
        msg: "author not found in db!!!",
      });
    }
  });
};
