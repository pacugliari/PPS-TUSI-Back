const express = require("express");
const router = express.Router();
const {
	getCartProductsController,
	validateCouponController,
} = require("../controllers/cart");

// POST /cart/products
router.post("/products", getCartProductsController);

// GET /cart/coupons/:code/validate
router.get("/coupons/:code/validate", validateCouponController);

module.exports = router;
