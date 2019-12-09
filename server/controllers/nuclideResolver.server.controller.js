/**
 *  Author: Alexey Makarevitch
 * 
 *  Description: This is a request handler for nuclide resolver requests.
 */

var Nuclide = require('../models/Nuclide.schema'),
    NuclideDoses = require('../models/NuclideDoses.schema'),
    NuclideICRP = require('../models/NuclideICRP.schema');

exports.getNuclideList = function(req, res, next) {
    // find all nuclides in half-life table. That technicaly corresponds to the entire list of available nuclides.
    Nuclide.find({}, (err, docs) => {
        if (!err) {
            var payload = [];
            for (var i = 0; i < docs.length; i++)
                payload.push({isotop: docs[i].isotop, nuclide: docs[i].nuclide});
            req.payload = payload;
            next();
        } else {
            next(err);
        }
    });
}

exports.getNuclidesLungClasses = function(req, res, next) {
    // return all lung classes for the specified isotop as a character array
    NuclideDoses.distinct('lung_class', {isotop: req.params.isotop}, (err, docs) => {
        if (!err) {
            req.payload = docs;
            next();
        } else {
            next(err);
        }
    });
}

exports.getNuclidesICRPLungClass = function(req, res, next) {
    // return the ICRP lung class for the given nuclide, return "NA" if not found
    NuclideICRP.findOne({nuclide: req.params.nuclide}, (err, docs) => {
        if (!err) {
            req.payload = docs && docs.icrp_lung_class ? docs.icrp_lung_class : "NA";
            next();
        } else {
            next(err);
        }
    });
}