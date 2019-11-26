var path = require('path'),  
    express = require('express'),
    morgan = require('morgan'),
    testRouter = require('../routes/test.server.routes'),
    calculationRouter = require('../routes/calculation.server.routes'),
    exportRouter = require('../routes/exports.server.routes'),
    nuclidesController = require('../routes/nuclideResolver.server.routes');
    bodyParser = require('body-parser');

module.exports.init = function() {

  //initialize app
  var app = express();

  app.use(morgan('dev'));

  app.use(bodyParser.json());

  app.use('/', express.static(__dirname + '/../../client'));

  // test api
  app.use('/api/test', testRouter);

  // calculations
  app.use('/api/calculate', calculationRouter);

  // exports
  app.use('/api/export', exportRouter);

  // querying data
  app.use('/api/nuclides', nuclidesController);

  app.all('/*', function(req, res) {
    res.sendFile(path.resolve('client/index.html'));
  });
  
  return app;
};  