var express = require("express"),
  calcController = require("../controllers/calculation.server.controller.js"),
  cors_handler = require("../config/cors.handler.js");
  jsonToExcelParser = require("../controllers/excelDataParser.server.controller.js");
  router = express.Router();

router
  .route("/fire")
  .post(calcController.resolveNuclideData, calcController.calculateFire, jsonToExcelParser.convertPayloadToExcel, cors_handler.CORS_respond)
  .options(cors_handler.CORS_handshake);

router
  .route("/plume")
  .post(calcController.resolveNuclideData, calcController.calculateGeneralPlume, jsonToExcelParser.convertPayloadToExcel, cors_handler.CORS_respond)
  .options(cors_handler.CORS_handshake);

module.exports = router;