const {
  fetchArticles,
  fetchArticle,
  updateArticle,
} = require("../models/articles.models");

const sendArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;

  fetchArticles(sort_by, order, author, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

const sendArticle = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticle(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { sendArticles, sendArticle, patchArticle };
