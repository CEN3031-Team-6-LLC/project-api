/**
 *  Author: Alexey Makarevitch
 * 
 *  Description: Worker script that registers express server on the specified port.
 */

var express = require("./express");

module.exports.start = function() {
  // instantiate express server
  var app = express.init();
  // set it to listen on either the local port 8080 or the supplied port when deployed
  var port = process.env.PORT || 8080;
  app.listen(port, function() {
    console.log(`Worker thread ${process.pid} is listening on port ${port}`);
  });
};
