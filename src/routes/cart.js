const express = require("express");
const router = express.Router();
const { getCartProductsController } = require("../controllers/cart");

// POST /cart/products
router.post("/products", getCartProductsController);

module.exports = router;
