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
	getCardsOptionsController
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

module.exports = router;
