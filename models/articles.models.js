const knex = require("../connection");

const { checkTopicExists } = require("./topics.models");

const { checkUserExists } = require("./users.models");

exports.fetchArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  const sortByString = `articles.${sort_by}`;

  if (order != "asc" && order != "desc") {
    return Promise.reject({
      status: 400,
      msg: "invalid sort order!!!",
    });
  }

  return Promise.all([checkTopicExists(topic), checkUserExists(author)]).then(
    () => {
      return knex
        .select(
          "articles.author",
          "articles.title",
          "articles.article_id",
          "articles.topic",
          "articles.created_at",
          "articles.votes"
        )
        .from("articles")
        .leftJoin("comments", "articles.article_id", "comments.article_id")
        .groupBy("articles.article_id")
        .count("comments.comment_id", { as: "comment_count" })
        .modify((query) => {
          if (topic) query.where("articles.topic", topic);
          if (author) query.where("articles.author", author);
        })
        .orderBy(sortByString, order)
        .then((articles) => {
          articles.forEach((article) => {
            article.comment_count = parseInt(article.comment_count);
          });
          return articles;
        });
    }
  );
};

exports.fetchArticle = (article_id) => {
  return knex
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.topic",
      "articles.created_at",
      "articles.votes",
      "articles.body"
    )
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count("comments.comment_id", { as: "comment_count" })
    .where("articles.article_id", article_id)
    .then((articleArray) => {
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

exports.updateArticle = (article_id, inc_votes = 0) => {
  return knex
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", article_id)
    .increment({ votes: inc_votes })
    .then(() => {
      return exports.fetchArticle(article_id);
    });
};

exports.checkArticleExists = (article_id) => {
  return knex
    .select()
    .from("articles")
    .modify((query) => {
      if (article_id) query.where("article_id", article_id);
    })
    .returning("*")
    .then((articleRows) => {
      if (articleRows.length != 0) {
        return true;
      } else {
        return Promise.reject({
          status: 404,
          msg: "article not found in db!!!",
        });
      }
    });
};
