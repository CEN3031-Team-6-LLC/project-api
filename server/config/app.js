var express = require("./express");

module.exports.start = function() {
  var app = express.init();
  var port = process.env.PORT || 8080;
  app.listen(port, function() {
    console.log("App.js file is listening on port", port);
  });
};
