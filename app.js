const express = require("express");
const apiRouter = require("./routes/api.router");

const {
  handlePSQLErrors,
  handleCustomErrors,
  badPathError,
} = require("./errors");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", badPathError);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);

module.exports = app;
