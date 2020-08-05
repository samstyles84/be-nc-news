const knex = require("../connection");
const { checkArticleExists } = require("./articles.models");

exports.addComment = (params, sent) => {
  return checkArticleExists(params.article_id).then(() => {
    const commentToInsert = {
      body: sent.body,
      author: sent.username,
      article_id: params.article_id,
    };
    const query = knex("comments").insert(commentToInsert).returning("*");
    return query.then((commentArray) => {
      return commentArray[0];
    });
  });
};

exports.fetchComments = (
  { article_id },
  { sort_by = "created_at", order = "desc" }
) => {
  const query = knex
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where("comments.article_id", article_id)
    .orderBy(sort_by, order);

  return query.then((comments) => {
    if (comments.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "article not found in db!!!",
      });
    } else return comments;
  });
};

exports.updateComment = (params, body) => {
  const { comment_id } = params;
  const { inc_votes } = body;

  if (Object.keys(body).length > 1) {
    return Promise.reject({
      status: 400,
      msg: "invalid patch parameter!!!",
    });
  }

  const query = knex
    .select("*")
    .from("comments")
    .where("comments.comment_id", comment_id)
    .increment({ votes: inc_votes })
    .returning("*");

  return query.then((commentArray) => {
    return commentArray[0];
  });
};
