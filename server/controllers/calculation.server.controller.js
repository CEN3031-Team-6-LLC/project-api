const engine = require("./calculation.engine.controller");

exports.calculateGeneralPlume = function(req, res, next) {
    var delta = req.body.distanceIncrement || 1;
    const maxX = req.body.maxDistance || 10000;
    var x = delta;
    var data = [];
    for (x; x <= maxX; x += delta) {
        data.push({
            distance: x,
            concentration: engine.engine.gaussian(
                req.body.stability.toUpperCase(),
                x,
                req.body.receptorHeight,
                req.body.releaseHeight,
                req.body.windSpeed,
                req.body.sourceAmount,
                undefined,
                undefined,
                false)
        });
    }
    req.payload = data;
    next();
};

exports.calculateFire = function(req, res, next) {
    const delta = req.body.distanceIncrement || 1;
    const maxX = req.body.maxDistance || 10000;
    var x = delta;
    var data = [];
    for (x; x <= maxX; x += delta) {
        data.push({
            distance: x,
            concentration: engine.engine.gaussian(
                req.body.stability.toUpperCase(),
                x,
                req.body.receptorHeight,
                undefined,
                req.body.windSpeed,
                req.body.sourceAmount,
                req.body.fireCloudTop,
                req.body.fireRadius,
                true)
        });
    }
    req.payload = data;
    next();
};
