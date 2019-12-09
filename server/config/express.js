/**
 *  Author: Alexey Makarevitch
 * 
 *  Description: Express server configuration. Here all middlewares are registered.
 */

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

  //initialize express server
  var app = express();

  // set request logging middleware
  app.use(morgan('dev'));

  // set JSON-string to the object parser middleware for request bodies
  app.use(bodyParser.json());

  // serve a static html page when the server is accessed outside of REST-full API endpoints
  app.use('/', express.static(__dirname + '/../../client'));

  // set global options handshake cors handler
  app.options('/api/*', cors_handler.CORS_handshake);

  // set test endpoints
  app.use('/api/test', testRouter);

  // set calculations endpoints
  app.use('/api/calculate', calculationRouter);

  // set exports endpoints
  app.use('/api/export', exportRouter);

  // set nuclides endpoints for nuclide data querying
  app.use('/api/nuclides', nuclidesController);

  // set global response cors handler
  app.use('/api/*', cors_handler.CORS_respond);

  // set global error handler
  app.use(error_handler.handle);

  // if don't know what to do - return static index page and pretend that's expected
  app.all('/*', function(req, res) {
    res.sendFile(path.resolve('client/index.html'));
  });
  
  return app;
};  