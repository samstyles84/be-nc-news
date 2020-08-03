exports.formatDates = (list) => {
  const formattedArray = [];

  list.forEach((object, i) => {
    formattedArray[i] = { ...object };
    formattedArray[i].created_at = new Date(formattedArray[i].created_at);
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
  const formattedArray = exports.formatDates(comments);
  formattedArray.forEach((comment) => {
    comment.author = comment.created_by;
    comment.article_id = articleRef[comment.belongs_to];
    delete comment.created_by;
    delete comment.belongs_to;
  });
  return formattedArray;
};
