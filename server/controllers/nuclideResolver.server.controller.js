var Nuclide = require('../models/Nuclide.schema'),
    NuclideDoses = require('../models/NuclideDoses.schema'),
    NuclideICRP = require('../models/NuclideICRP.schema');

exports.getNuclideList = function(req, res, next) {
    if (req.error) {
        next();
        return;
    }
    Nuclide.find({}, (err, docs) => {
        if (!err) {
            var payload = [];
            for (var i = 0; i < docs.length; i++)
                payload.push({isotop: docs[i].isotop, nuclide: docs[i].nuclide});
            req.payload = payload;
            next();
        } else {
            console.error(err);
            req.error = true;
            req.payload = err.message;
            next();
        }
    });
}

exports.getNuclidesLungClasses = function(req, res, next) {
    if (req.error) {
        next();
        return;
    }
    NuclideDoses.distinct('lung_class', {isotop: req.params.isotop}, (err, docs) => {
        if (!err) {
            req.payload = docs;
            next();
        } else {
            console.error(err);
            req.error = true;
            req.payload = err.message;
            next();
        }
    });
}

exports.getNuclidesICRPLungClass = function(req, res, next) {
    if (req.error) {
        next();
        return;
    }
    NuclideICRP.findOne({nuclide: req.params.nuclide}, (err, docs) => {
        if (!err) {
            req.payload = docs && docs.icrp_lung_class ? docs.icrp_lung_class : "NA";
            next();
        } else {
            console.error(err);
            req.error = true;
            req.payload = err.message;
            next();
        }
    });
}