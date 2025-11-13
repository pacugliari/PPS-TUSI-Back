const express = require("express");
const router = express.Router();
const {
  getPopularProductsController,
  getLatestProductsController,
  getCarouselPrincipalController,
  getCarouselMarcasController,
} = require("../controllers/home");

router.get("/popularProducts", getPopularProductsController);
router.get("/latestProducts", getLatestProductsController);
router.get("/carousel", getCarouselPrincipalController);
router.get("/carousel-brands", getCarouselMarcasController);

module.exports = router;
