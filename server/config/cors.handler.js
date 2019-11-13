const config = process.env.NODE_ENV == "PROD" ? {} : require("./config.js");

// middleware to configure CORS handling

exports.CORS_handshake = function(req, res) {
    res.header("Access-Control-Allow-Origin", process.env.ALLOWED_UI_DOMAINS || config.allowed_ui_domains);
    res.header("Access-Control-Allow-Methods", "POST");
    res.header("Access-Control-Allow-Headers", 
        "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin");
    res.send();
}

exports.CORS_respond = function(req, res) {
    res.header("Access-Control-Allow-Origin", process.env.ALLOWED_UI_DOMAINS || config.allowed_ui_domains);
    res.send(req.payload);
}