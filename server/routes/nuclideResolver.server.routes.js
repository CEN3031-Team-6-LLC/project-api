/**
 *  Author: Alexey Makarevitch
 * 
 *  Description: This is a router for nuclide resolver endpoints.
 */

var express = require("express"),
    nuclides = require("../controllers/nuclideResolver.server.controller"),
    router = express.Router();

router
    .route("/getNuclideList")
    .get(
        nuclides.getNuclideList);

router
    .route("/getNuclidesLungClasses/:isotop")
    .get(
        nuclides.getNuclidesLungClasses);

router
    .route("/getNuclidesICRPLungClass/:nuclide")
    .get(
        nuclides.getNuclidesICRPLungClass);

module.exports = router;
