/**
 *  Author: Alexey Makarevitch
 * 
 *  Description: This is a router for test endpoints. Used only to check if
 *  server is up and if express is configured correctly.
 */

var express = require('express'),
    controller = require('../controllers/test.server.controller'),
    router = express.Router();

router.route('/')
    .get(controller.hello);

router.route('/:who')
    .get(controller.helloDude);

module.exports = router;