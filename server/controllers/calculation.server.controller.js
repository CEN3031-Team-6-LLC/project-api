/**
 *  Author: Alexey Makarevitch
 * 
 *  Description: This is a calculation middleware for calculate and export requests.
 */

const engine = require("./calculation.engine.controller");
var Nuclide = require('../models/Nuclide.schema'),
    NuclideDoses = require('../models/NuclideDoses.schema');

// middleware to get nuclide information for calculations
exports.resolveNuclideData = async function(req, res, next) {
    try {
        var effectiveDose = await (await NuclideDoses.find({
            isotop: req.body.isotop,
            lung_class: req.body.lungClass
        }).sort({age: -1}).limit(1).exec())[0].effective_dose;
        var halfLife = await (await Nuclide.findOne({
            isotop: req.body.isotop
        }).exec()).half_life;
        req.body.effectiveDose = effectiveDose;
        req.body.halfLife = halfLife;
    } catch (err) {
        next(err);
    }
    next();
}

// calculation middleware for plume
exports.calculateGeneralPlume = async function(req, res, next) {
    try {
        var delta = req.body.distanceIncrement || 1;
        const maxX = req.body.maxDistance || 10000;
        var x = req.body.distanceIncrement <= 1 ? 1 : 0;
        var data = [];
        for (x; x <= maxX; x += delta) {
            x = parseFloat(x.toFixed(2));
            var C = engine.engine.gaussian(
                req.body.stability.toUpperCase(),
                (x === 0 ? 1 : x),
                req.body.receptorHeight,
                req.body.releaseHeight,
                req.body.windSpeed,
                req.body.sourceAmount,
                undefined,
                undefined,
                false);
            
            var concentrationAdj = engine.engine.adjustedConcentration(C, req.body.halfLife, req.body.windSpeed, (x === 0 ? 1 : x));

            data.push({
                distance: (x === 0 ? 1 : x),
                concentration: concentrationAdj,
                dose: engine.engine.dose(concentrationAdj, req.body.effectiveDose),
                arrivalTime: engine.engine.arrivalTime(req.body.windSpeed, (x === 0 ? 1 : x))
            });
        }
        req.payload = data;
    } catch (err) {
        next(err);
    }
    next();
};

// calculation middleware for fire
exports.calculateFire = function(req, res, next) {
    try {
        const delta = req.body.distanceIncrement || 1;
        const maxX = req.body.maxDistance || 10000;
        var x = req.body.distanceIncrement <= 1 ? 1 : 0;
        var data = [];
        for (x; x <= maxX; x += delta) {
            x = parseFloat(x.toFixed(2));
            var C = engine.engine.gaussian(
                req.body.stability.toUpperCase(),
                (x === 0 ? 1 : x),
                req.body.receptorHeight,
                undefined,
                req.body.windSpeed,
                req.body.sourceAmount,
                req.body.fireCloudTop,
                req.body.fireRadius,
                true);

            var concentrationAdj = engine.engine.adjustedConcentration(C, req.body.halfLife, req.body.windSpeed, (x === 0 ? 1 : x));
        
            data.push({
                distance: (x === 0 ? 1 : x),
                concentration: concentrationAdj,
                dose: engine.engine.dose(concentrationAdj, req.body.effectiveDose),
                arrivalTime: engine.engine.arrivalTime(req.body.windSpeed, (x === 0 ? 1 : x))
            });
        }
        req.payload = data;
    } catch (err) {
        next(err);
    }
    next();
};
