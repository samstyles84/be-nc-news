const fs = require("fs");

exports.getAPIJSON = (cb) => {
  fs.readFile("./endpoints.json", "utf8", (err, apiJSON) => {
    // console.log(apiJSON, "readfile");
    cb(null, apiJSON);
  });
};
