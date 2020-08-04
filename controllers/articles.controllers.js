const { fetchArticles } = require("../models/articles.models");

const sendArticles = (req, res, next) => {
  fetchArticles(req.query)
    .then((articles) => {
      if (articles.length === 0) {
        //How do we check if the author/topic exists?  Do we need to query the db again? Use joins?
        return Promise.reject({
          status: 400,
          msg: "author/topic not found in db, or no articles found!!!",
        });
      } else {
        articles.forEach((article) => {
          delete article.body;
          article.comment_count = parseInt(article.comment_count);
        });
        res.send({ articles });
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = sendArticles;
