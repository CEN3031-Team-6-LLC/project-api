var Nuclide = require('../models/Nuclide.schema'),
    NuclideDoses = require('../models/NuclideDoses.schema'),
    NuclideICRP = require('../models/NuclideICRP.schema');

exports.getNuclideList = function(req, res, next) {
    Nuclide.find({}, (err, docs) => {
        if (!err) {
            var payload = [];
            for (var i = 0; i < docs.length; i++)
                payload.push({isotop: docs[i].isotop, nuclide: docs[i].nuclide});
            req.payload = payload;
            next();
        } else {
            res.error(err);
        }
    });
}

exports.getNuclidesLungClasses = function(req, res, next) {
    NuclideDoses.distinct('lung_class', {isotop: req.params.isotop}, (err, docs) => {
        if (!err) {
            req.payload = docs;
            next();
        } else {
            res.error(err);
        }
    });
}

exports.getNuclidesICRPLungClass = function(req, res, next) {
    NuclideICRP.findOne({nuclide: req.params.nuclide}, (err, docs) => {
        if (!err) {
            req.payload = docs && docs.icrp_lung_class ? docs.icrp_lung_class : "NA";
            next();
        } else {
            res.error(err);
        }
    });
}