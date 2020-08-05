const {
  fetchArticles,
  fetchArticle,
  updateArticle,
} = require("../models/articles.models");

const sendArticles = (req, res, next) => {
  fetchArticles(req.query)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

const sendArticle = (req, res, next) => {
  fetchArticle(req.params)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const patchArticle = (req, res, next) => {
  updateArticle(req.params, req.body)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { sendArticles, sendArticle, patchArticle };
