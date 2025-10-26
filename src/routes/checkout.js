const express = require("express");
const router = express.Router();
const { getCheckoutOptionsController } = require("../controllers/checkout");

// GET /checkout/options
router.get("/options", getCheckoutOptionsController);

module.exports = router;
