const {
  addComment,
  fetchComments,
  updateComment,
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
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { postComment, sendComments, patchComment };
