const express = require("express");
const apiRouter = require("./routes/api.router");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found! :-(" });
});

app.use((err, req, res, next) => {
  if (err.code === "42703" || err.code === "22P02") {
    res.status(400).send({ msg: "bad request to db!!!" });
  } else if ("status" in err) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    console.log(err);
  }
});

module.exports = app;
