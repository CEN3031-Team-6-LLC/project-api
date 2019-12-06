var path = require('path'),  
    express = require('express'),
    morgan = require('morgan'),
    testRouter = require('../routes/test.server.routes'),
    calculationRouter = require('../routes/calculation.server.routes'),
    exportRouter = require('../routes/exports.server.routes'),
    nuclidesController = require('../routes/nuclideResolver.server.routes'),
    cors_handler = require("../handlers/cors.handler"),
    error_handler = require("../handlers/error.handler"),
    bodyParser = require('body-parser');

module.exports.init = function() {

  //initialize app
  var app = express();

  app.use(morgan('dev'));

  app.use(bodyParser.json());

  app.use('/', express.static(__dirname + '/../../client'));

  // global options handshake cors handler
  app.options('/api/*', cors_handler.CORS_handshake);

  // test api
  app.use('/api/test', testRouter);

  // calculations
  app.use('/api/calculate', calculationRouter);

  // exports
  app.use('/api/export', exportRouter);

  // querying data
  app.use('/api/nuclides', nuclidesController);

  // global response cors handler
  app.use('/api/*', cors_handler.CORS_respond);

  //global error handler
  app.use(error_handler.handle);

  // if don't know what to do - return index page and pretend that's expected
  app.all('/*', function(req, res) {
    res.sendFile(path.resolve('client/index.html'));
  });
  
  return app;
};  