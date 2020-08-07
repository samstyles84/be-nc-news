const {
  addComment,
  fetchComments,
  updateComment,
  removeComment,
} = require("../models/comments.models");

const postComment = (req, res, next) => {
  addComment(req.params, req.body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

const sendComments = (req, res, next) => {
  fetchComments(req.params, req.query)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

const patchComment = (req, res, next) => {
  updateComment(req.params, req.body)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteComment = (req, res, next) => {
  removeComment(req.params)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { postComment, sendComments, patchComment, deleteComment };
