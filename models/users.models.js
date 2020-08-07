const knex = require("../connection");

exports.fetchUser = (username) => {
  return knex
    .select()
    .from("users")
    .where({ username: username })
    .then((userArray) => {
      if (userArray.length === 0) {
        return Promise.reject({ status: 404, msg: "username not found" });
      } else {
        return userArray[0];
      }
    });
};

exports.checkUserExists = (user) => {
  return knex
    .select()
    .from("users")
    .modify((query) => {
      if (user) query.where("username", user);
    })
    .returning("*")
    .then((userRows) => {
      if (userRows.length != 0) {
        return true;
      } else {
        return Promise.reject({
          status: 404,
          msg: "author not found in db!!!",
        });
      }
    });
};
