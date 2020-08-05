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

  if (order != "asc" && order != "desc") {
    return Promise.reject({
      status: 400,
      msg: "invalid sort order!!!",
    });
  }

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
      return query.then((articles) => {
        articles.forEach((article) => {
          delete article.body;
          article.comment_count = parseInt(article.comment_count);
        });
        return articles;
      });
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
  return query.then((articleArray) => {
    if (articleArray.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "article not found!!!",
      });
    }
    articleArray[0].comment_count = parseInt(articleArray[0].comment_count);
    return articleArray[0];
  });
};

exports.updateArticle = (params, body) => {
  const { article_id } = params;
  const { inc_votes } = body;

  if (Object.keys(body).length > 1) {
    return Promise.reject({
      status: 400,
      msg: "invalid patch parameter!!!",
    });
  }

  const query = knex
    .select("articles.*")
    .from("articles")
    .where("article_id", article_id)
    .increment({ votes: inc_votes })
    .returning("*");

  return query.then((articleArray) => {
    return exports.fetchArticle(params);
  });
};

// this.fetchArticle(req.params).then();

// return query.then((articleArray) => {
//   console.log(articleArray, "<-article array");
//   articleArray[0].comment_count = parseInt(articleArray[0].comment_count);
//   return articleArray[0];
// });
