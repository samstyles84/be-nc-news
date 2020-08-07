const {
  addComment,
  fetchComments,
  updateComment,
  removeComment,
} = require("../models/comments.models");

const postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { body, username } = req.body;

  addComment(article_id, body, username)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

const sendComments = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;

  fetchComments(article_id, sort_by, order)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

const patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  updateComment(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { postComment, sendComments, patchComment, deleteComment };
