exports.formatDates = (list) => {
  const formattedArray = [];

  list.forEach((object, i) => {
    formattedArray[i] = { ...object };
    formattedArray[i].created_at = new Date(formattedArray[i].created_at);
  });
  return formattedArray;
};

exports.makeRefObj = (list) => {};

exports.formatComments = (comments, articleRef) => {};
