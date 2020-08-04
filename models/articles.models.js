const knex = require("../connection");

const { checkTopicExists } = require("./topics.models");

const { checkUserExists } = require("./users.models");

exports.fetchArticles = ({
  sort_by = "created_at",
  order = "desc",
  author = "all",
  topic = "all",
}) => {
  const sortByString = `articles.${sort_by}`;

  if (order != "asc" && order != "desc")
    return Promise.reject({
      status: 400,
      msg: "invalid sort order!!!",
    });

  const query = knex
    .select("articles.*")
    .from("articles")
    .join("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count("comments.comment_id", { as: "comment_count" })
    .orderBy(sortByString, order);

  return checkTopicExists(topic).then((topicExists) => {
    if (topic != "all") query.where("articles.topic", topic);
    return checkUserExists(author).then((userExists) => {
      if (author != "all") query.where("articles.author", author);
      return query;
    });
  });
};

exports.fetchArticle = ({ article_id }) => {
  const query = knex
    .select("articles.*")
    .from("articles")
    .join("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count("comments.comment_id", { as: "comment_count" })
    .where("articles.article_id", article_id);
  return query;
};
