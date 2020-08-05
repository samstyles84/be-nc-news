exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "42703" || err.code === "22P02") {
    res.status(400).send({ msg: "bad request to db!!!" });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if ("status" in err) {
    res.status(err.status).send({ msg: err.msg });
  } else console.log(err);
};

exports.handle405s = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed!!!" });
};

exports.badPathError = (req, res, next) => {
  res.status(404).send({ msg: "Path not found! :-(" });
};
