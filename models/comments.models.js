const knex = require("../connection");
const { checkArticleExists } = require("./articles.models");

exports.addComment = (params, sent) => {
  return checkArticleExists(params.article_id).then(() => {
    const commentToInsert = {
      body: sent.body,
      author: sent.username,
      article_id: params.article_id,
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
  { article_id },
  { sort_by = "created_at", order = "desc" }
) => {
  return checkArticleExists(article_id).then(() => {
    return knex
      .select("comment_id", "votes", "created_at", "author", "body")
      .from("comments")
      .where("comments.article_id", article_id)
      .orderBy(sort_by, order);
  });
};

exports.updateComment = (params, body) => {
  const { comment_id } = params;
  const { inc_votes = 0 } = body;

  if (Object.keys(body).length > 1) {
    return Promise.reject({
      status: 400,
      msg: "invalid patch parameter!!!",
    });
  }

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

exports.removeComment = (params) => {
  const { comment_id } = params;
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
