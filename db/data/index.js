const testData = require("./test-data");
const developmentdata = require("./development-data");
const ENV = process.env.NODE_ENV || "development";

if (ENV === "development") exportData = developmentdata;
else exportData = testData;

module.exports = exportData;
