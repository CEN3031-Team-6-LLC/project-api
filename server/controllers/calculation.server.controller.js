const engine = require("./calculation.engine.controller");
var Nuclide = require('../models/Nuclide.schema'),
    NuclideDoses = require('../models/NuclideDoses.schema');

exports.resolveNuclideData = async function(req, res, next) {
    var effectiveDose = await (await NuclideDoses.find({
        isotop: req.body.isotop,
        lung_class: req.body.lungClass
    }).sort({age: -1}).limit(1).exec())[0].effective_dose;
    var halfLife = await (await Nuclide.find({
        isotop: req.body.isotop
    }).sort({age: -1}).limit(1).exec())[0].half_life;
    req.body.effectiveDose = effectiveDose;
    req.body.halfLife = halfLife;
    next();
}

exports.calculateGeneralPlume = async function(req, res, next) {
    var delta = req.body.distanceIncrement || 1;
    const maxX = req.body.maxDistance || 10000;
    var x = delta;
    var data = [];
    for (x; x <= maxX; x += delta) {
        var C = engine.engine.gaussian(
            req.body.stability.toUpperCase(),
            x,
            req.body.receptorHeight,
            req.body.releaseHeight,
            req.body.windSpeed,
            req.body.sourceAmount,
            undefined,
            undefined,
            false);

        data.push({
            distance: x,
            concentration: C,
            dose: engine.engine.dose(C, req.body.effectiveDose, req.body.halfLife, req.body.windSpeed, x),
            arrivalTime: engine.engine.arrivalTime(req.body.windSpeed, x)
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
        var C = engine.engine.gaussian(
            req.body.stability.toUpperCase(),
            x,
            req.body.receptorHeight,
            undefined,
            req.body.windSpeed,
            req.body.sourceAmount,
            req.body.fireCloudTop,
            req.body.fireRadius,
            true);
        data.push({
            distance: x,
            concentration: C,
            dose: engine.engine.dose(C, req.body.effectiveDose, req.body.halfLife, req.body.windSpeed, x),
            arrivalTime: engine.engine.arrivalTime(req.body.windSpeed, x)
        });
    }
    req.payload = data;
    next();
};
