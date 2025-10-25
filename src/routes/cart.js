const express = require("express");
const router = express.Router();
const {
	getCartProductsController,
	validateCouponController,
} = require("../controllers/cart");


router.post("/products", getCartProductsController);
router.post("/coupons/validate", validateCouponController);

module.exports = router;
