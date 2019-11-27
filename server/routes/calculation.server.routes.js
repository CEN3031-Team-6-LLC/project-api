var express = require("express"),
  controller = require("../controllers/calculation.server.controller.js"),
  cors_handler = require("../config/cors.handler.js"),
  validations = require("../controllers/validations.server.controller"),
  router = express.Router();

router
  .route("/fire")
  .post(
    validations.validateReqestBody,
    controller.resolveNuclideData,
    controller.calculateFire,
    cors_handler.CORS_respond)
  .options(cors_handler.CORS_handshake);

router
  .route("/plume")
  .post(
    validations.validateReqestBody,
    controller.resolveNuclideData,
    controller.calculateGeneralPlume,
    cors_handler.CORS_respond)
  .options(cors_handler.CORS_handshake);

module.exports = router;
