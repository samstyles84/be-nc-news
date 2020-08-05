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
          // we could omit the body by not selecting the column!!
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
    .where("articles.article_id", article_id)
    .increment({ votes: inc_votes });

  return query.then(() => {
    return exports.fetchArticle(params);
    //open to interpretation whether this step is needed!
  });
};

exports.checkArticleExists = (article_id) => {
  const articleQuery = knex.select().from("articles").returning("*");

  if (article_id != "all") articleQuery.where("article_id", article_id);

  return articleQuery.then((articleRows) => {
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
