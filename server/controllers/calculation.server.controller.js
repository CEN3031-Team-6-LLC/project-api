const engine = require("./calculation.engine.controller");

exports.calculateGeneralPlume = function(req, res, next) {
  var delta = 1;
  const maxX = 10000;
  var x = 0,
    y = 0,
    z = 0;
  var data = [];
  var material = Math.pow(10, 9);
  for (x; x <= maxX; x += delta) {
    data.push({
      x: x,
      y: engine.engine.gaussian(
        "F",
        x,
        y,
        z,
        req.body.receptorHeights,
        req.body.windSpeed,
        material
      )
    });
  }
  req.payload = data;
  res.send(data);
};

exports.calculateFire = function(req, res, next) {
  var delta = 1;
  const maxX = 10000;
  var x = 0,
    y = 0,
    z = 0;
  var data = [];
  var material = Math.pow(10, 9);
  for (x; x <= maxX; x += delta) {
    data.push({
      x: x,
      y: engine.engine.gaussian(
        req.body.stability.toUpperCase(),
        x,
        y,
        z,
        req.body.receptorHeights,
        req.body.windSpeed,
        material
      )
    });
  }
  req.payload = data;
  res.send(data);
};
