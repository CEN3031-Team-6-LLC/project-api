var express = require("express"),
    calcController = require("../controllers/calculation.server.controller"),
    jsonToExcelParser = require("../controllers/excelDataParser.server.controller"),
    validations = require("../controllers/validations.server.controller"),
    router = express.Router();

router
    .route("/fire")
    .post(
        validations.validateReqestBody,
        calcController.resolveNuclideData,
        calcController.calculateFire,
        jsonToExcelParser.convertPayloadToExcel);

router
    .route("/plume")
    .post(
        validations.validateReqestBody,
        calcController.resolveNuclideData,
        calcController.calculateGeneralPlume,
        jsonToExcelParser.convertPayloadToExcel);

module.exports = router;