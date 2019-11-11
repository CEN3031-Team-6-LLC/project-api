const config = require("./config.js");

// middleware to configure CORS handling

exports.CORS_handshake = function(req, res) {
    res.header("Access-Control-Allow-Origin", process.env.ALLOWED_UI_DOMAINS || config.allowed_ui_domains);
    res.header("Access-Control-Allow-Methods", "POST");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Accept"
    );
    res.send();
}

exports.CORS_respond = function(req, res) {
    res.header("Access-Control-Allow-Origin", process.env.ALLOWED_UI_DOMAINS || config.allowed_ui_domains);
    res.send(req.payload);
}