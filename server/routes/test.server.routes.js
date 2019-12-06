var express = require('express'),
    controller = require('../controllers/test.server.controller'),
    router = express.Router();

router.route('/')
    .get(controller.hello);

router.route('/:who')
    .get(controller.helloDude);

module.exports = router;