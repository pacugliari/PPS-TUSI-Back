const express = require("express");
const router = express.Router();

const {
	getAccountAddressesController,
	postAccountAddressController,
	putAccountAddressController,
	deleteAccountAddressController,
	setPrimaryAddressController,
	getFavoritesController,
	getAccountAddressesOptionsController,
	getCardsController,
	postCardsController,
	deleteCardsController,
	getCardsOptionsController,
	getProfileController,
	putProfileController,
	getOrdersController,
	getOrderDetailController
} = require("../controllers/account");

//DIRECCIONES
router.get("/addresses", getAccountAddressesController);
router.get("/addresses/options", getAccountAddressesOptionsController);
router.post("/addresses", postAccountAddressController);
router.put("/addresses/:id", putAccountAddressController);
router.delete("/addresses/:id", deleteAccountAddressController);
router.patch("/addresses/:id/set-primary", setPrimaryAddressController);

//FAVORITOS
router.post("/favorites", getFavoritesController);

//TARJETAS
router.get("/cards", getCardsController);
router.get("/cards/options", getCardsOptionsController);
router.post("/cards", postCardsController);
router.delete("/cards/:id", deleteCardsController);

//PROFILE
router.get("/profile", getProfileController);
router.put("/profile", putProfileController);

//ORDERS
router.get("/orders", getOrdersController);
router.get("/orders/:id", getOrderDetailController);

module.exports = router;
