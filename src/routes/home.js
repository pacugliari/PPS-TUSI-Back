const express = require("express");
const router = express.Router();
const { getPopularProductsController, getLatestProductsController } = require("../controllers/home");

router.get("/popularProducts", getPopularProductsController);
router.get("/latestProducts", getLatestProductsController);

module.exports = router;
