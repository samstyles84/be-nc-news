//const data = { test, development, production: development };
const testData = require("./test-data");
const developmentdata = require("./development-data");
const production = require("./development-data");

const ENV = process.env.NODE_ENV || "development";

if (ENV !== "test") exportData = developmentdata;
else exportData = testData;

module.exports = exportData;
