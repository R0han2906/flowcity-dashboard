const express = require("express");
const router = express.Router();
const controller = require("../controllers/disruption.controller");

router.post("/simulate", controller.simulateDelay);

module.exports = router;