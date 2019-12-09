/**
 *  Author: Alexey Makarevitch
 * 
 *  Description: A global error handler, if error is thrown by any middleware
 *  it will be caught here, logged and forwarded to the UI with 500 status.
 */

const config = process.env.NODE_ENV == "PROD" ? {} : require("../config/config");

exports.handle = function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).append("Access-Control-Allow-Origin", process.env.ALLOWED_UI_DOMAINS || config.allowed_ui_domains).send(err.message);
}