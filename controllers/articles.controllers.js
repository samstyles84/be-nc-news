const { fetchArticles, fetchArticle } = require("../models/articles.models");

const sendArticles = (req, res, next) => {
  fetchArticles(req.query)
    .then((articles) => {
      articles.forEach((article) => {
        delete article.body;
        article.comment_count = parseInt(article.comment_count);
      });
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

const sendArticle = (req, res, next) => {
  fetchArticle(req.params)
    .then((articleArray) => {
      //Could do this logic in the model instead - e.g. if we change a column name, we only want to chage the model, not a controller
      const article = articleArray[0];
      article.comment_count = parseInt(article.comment_count);
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { sendArticles, sendArticle };
