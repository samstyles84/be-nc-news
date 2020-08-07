const commentsControllers = require("../../controllers/comments.controllers");

exports.formatDates = (list) => {
  const formattedArray = list.map(({ ...object }) => {
    object.created_at = new Date(object.created_at);
    return object;
  });

  return formattedArray;
};

exports.makeRefObj = (list) => {
  const refObj = {};
  list.forEach((item) => {
    const val = item.article_id;
    const key = item.title;
    refObj[key] = val;
  });

  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  const formattedArray = comments.map(({ ...comment }) => {
    comment.author = comment.created_by;
    comment.article_id = articleRef[comment.belongs_to];
    comment.created_at = new Date(comment.created_at);
    delete comment.created_by;
    delete comment.belongs_to;
    return comment;
  });

  return formattedArray;
};
