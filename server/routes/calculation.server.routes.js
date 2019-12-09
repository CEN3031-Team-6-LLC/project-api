/**
 *  Author: Alexey Makarevitch
 * 
 *  Description: This is a router for calculate endpoints.
 */

var express = require("express"),
  controller = require("../controllers/calculation.server.controller"),
  validations = require("../controllers/validations.server.controller"),
  router = express.Router();

router
  .route("/fire")
  .post(
    validations.validateReqestBody,
    controller.resolveNuclideData,
    controller.calculateFire);

router
  .route("/plume")
  .post(
    validations.validateReqestBody,
    controller.resolveNuclideData,
    controller.calculateGeneralPlume);

module.exports = router;
