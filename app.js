const express = require("express");
const apiRouter = require("./routes/api.router");

const {
  handlePSQLErrors,
  handleCustomErrors,
  badPathError,
  handle500s,
} = require("./errors");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", badPathError);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;
