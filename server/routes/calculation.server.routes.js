var express = require("express"),
  controller = require("../controllers/calculation.server.controller.js"),
  cors_handler = require("../config/cors.handler.js");
  router = express.Router();

router
  .route("/fire")
  .post(controller.calculateFire, cors_handler.CORS_respond)
  .options(cors_handler.CORS_handshake);

router
  .route("/plume")
  .post(controller.calculateGeneralPlume, cors_handler.CORS_respond)
  .options(cors_handler.CORS_handshake);

module.exports = router;
