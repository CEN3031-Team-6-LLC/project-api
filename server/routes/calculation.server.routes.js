var express = require("express"),
  controller = require("../controllers/calculation.server.controller.js"),
  router = express.Router();

router
  .route("/fire")
  .post(controller.calculateFire)
  .options((req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Accept"
    );
    res.send();
  });

router
  .route("/plume")
  .post(controller.calculateGeneralPlume)
  .options((req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Accept"
    );
    res.send();
  });

module.exports = router;
