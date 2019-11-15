var path = require("path"),
  express = require("express"),
  morgan = require("morgan"),
  testRouter = require("../routes/test.server.routes"),
  calculationRouter = require("../routes/calculation.server.routes"),
  bodyParser = require("body-parser"),
  cors = require("cors");

const allowedOrigins = [
  "http://localhost:3000",
  "https://sleepy-garden-43138.herokuapp.com"
];

const corsFunction = (origin, callback) => {
  console.log(`${origin} is making a request`);

  if (!origin) return callback(null, true);

  if (allowedOrigins.indexOf(origin) === -1) {
    var msg =
      "The CORS policy for this site does not " +
      "allow access from the specified Origin.";
    return callback(new Error(msg), false);
  }
  return callback(null, true);
};

module.exports.init = function() {
  //initialize app
  var app = express();

  app.use(morgan("dev"));

  app.use(bodyParser.json());
  app.use(cors({ origin: corsFunction }));

  app.use("/", express.static(__dirname + "/../../client"));

  // test api
  app.use("/api/test", testRouter);

  // calculations
  app.use("/api/calculate", calculationRouter);

  app.all("/*", function(req, res) {
    res.sendFile(path.resolve("client/index.html"));
  });

  return app;
};
