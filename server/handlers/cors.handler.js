/**
 *  Author: Alexey Makarevitch
 * 
 *  Description: A middleware to configure CORS handling.
 */

const config = process.env.NODE_ENV == "PROD" ? {} : require("../config/config");

// CORS compliant request handler for OPTION requests.
exports.CORS_handshake = function(req, res) {
    // allow requests originating from localhost or specified UI application
    res.header("Access-Control-Allow-Origin", process.env.ALLOWED_UI_DOMAINS || config.allowed_ui_domains);
    // allow post and get methods
    res.header("Access-Control-Allow-Methods", "POST, GET");
    // allow required request headers
    res.header("Access-Control-Allow-Headers", 
        "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin, Content-Disposition");
    res.send();
}

// CORS compliant middleware to allow requests to be processed by the browser
exports.CORS_respond = function(req, res) {
    // add allow origin header to the response to prevent being block by the browser security policy
    res.header("Access-Control-Allow-Origin", process.env.ALLOWED_UI_DOMAINS || config.allowed_ui_domains);
    res.send(req.payload);
}