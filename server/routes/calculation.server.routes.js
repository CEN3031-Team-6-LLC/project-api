var express = require('express'),
    controller = require('../controllers/calculation.server.controller.js'),
    router = express.Router();

router.route('/fire')
    .post(controller.calculateFire);

router.route('/plume')
    .post(controller.calculateGeneralPlume);

module.exports = router;