exports.handle405s = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed!!!" });
};

exports.badPathError = (req, res, next) => {
  res.status(404).send({ msg: "Path not found! :-(" });
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (
    err.code === "42703" ||
    err.code === "22P02" ||
    err.code === "23503" ||
    err.code === "23502"
  ) {
    res.status(400).send({ msg: "bad request to db!!!" });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if ("status" in err) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "server error!!!" });
};
