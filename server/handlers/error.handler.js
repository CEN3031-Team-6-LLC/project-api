const config = process.env.NODE_ENV == "PROD" ? {} : require("../config/config");

// middleware to handle api errors

exports.handle = function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).append("Access-Control-Allow-Origin", process.env.ALLOWED_UI_DOMAINS || config.allowed_ui_domains).send(err.message);
}