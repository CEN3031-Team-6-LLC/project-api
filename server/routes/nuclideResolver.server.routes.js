var express = require("express"),
  cors_handler = require("../config/cors.handler.js");
  jsonToExcelParser = require("../controllers/excelDataParser.server.controller.js");
  router = express.Router();

router
    .route("/getNuclideList")
    .get(cors_handler.CORS_respond)
    .options(cors_handler.CORS_handshake);

router
    .route("/getNuclidesLungClasses")
    .get(cors_handler.CORS_respond)
    .options(cors_handler.CORS_handshake);

router
    .route("/getNuclidesICRPLungClass")
    .get(cors_handler.CORS_respond)
    .options(cors_handler.CORS_handshake);

return router;
