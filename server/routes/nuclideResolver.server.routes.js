var express = require("express"),
    cors_handler = require("../config/cors.handler.js"),
    nuclides = require("../controllers/nuclideResolver.server.controller"),
    router = express.Router();

router
    .route("/getNuclideList")
    .get(nuclides.getNuclideList, cors_handler.CORS_respond)
    .options(cors_handler.CORS_handshake);

router
    .route("/getNuclidesLungClasses/:isotop")
    .get(nuclides.getNuclidesLungClasses, cors_handler.CORS_respond)
    .options(cors_handler.CORS_handshake);

router
    .route("/getNuclidesICRPLungClass/:nuclide")
    .get(nuclides.getNuclidesICRPLungClass, cors_handler.CORS_respond)
    .options(cors_handler.CORS_handshake);

module.exports = router;
