const express = require("express");
const router = express.Router();

const {
	getAccountAddressesController,
	postAccountAddressController,
	putAccountAddressController,
	deleteAccountAddressController,
	setPrimaryAddressController,
	getFavoritesController,
	getZonesController
} = require("../controllers/account");

router.get("/addresses", getAccountAddressesController);
router.post("/addresses", postAccountAddressController);
router.put("/addresses/:id", putAccountAddressController);
router.delete("/addresses/:id", deleteAccountAddressController);
router.patch("/addresses/:id/set-primary", setPrimaryAddressController);
router.post("/favorites", getFavoritesController);
router.get("/zones", getZonesController);

module.exports = router;
