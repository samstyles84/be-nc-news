const knex = require("../connection");
const { checkArticleExists } = require("./articles.models");

exports.addComment = (article_id, body, username) => {
  return checkArticleExists(article_id).then(() => {
    const commentToInsert = {
      body: body,
      author: username,
      article_id: article_id,
    };

    return knex("comments")
      .insert(commentToInsert)
      .returning("*")
      .then((commentArray) => {
        return commentArray[0];
      });
  });
};

exports.fetchComments = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  return checkArticleExists(article_id).then(() => {
    return knex
      .select("comment_id", "votes", "created_at", "author", "body")
      .from("comments")
      .where("comments.article_id", article_id)
      .orderBy(sort_by, order);
  });
};

exports.updateComment = (comment_id, inc_votes = 0) => {
  return knex
    .from("comments")
    .where("comments.comment_id", comment_id)
    .increment({ votes: inc_votes })
    .returning("*")
    .then((commentArray) => {
      if (commentArray.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "non-existant comment id!!!",
        });
      }
      return commentArray[0];
    });
};

exports.removeComment = (comment_id) => {
  return knex
    .select("*")
    .from("comments")
    .where("comments.comment_id", comment_id)
    .del()
    .then((itemsDeleted) => {
      if (itemsDeleted === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment not found in db!!!",
        });
      }
    });
};
