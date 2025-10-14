const express = require("express");
const router = express.Router();

const {
	getAccountAddressesController,
	postAccountAddressController,
	putAccountAddressController,
	deleteAccountAddressController
} = require("../controllers/account");

router.get("/addresses", getAccountAddressesController);
router.post("/addresses", postAccountAddressController);
router.put("/addresses/:id", putAccountAddressController);
router.delete("/addresses/:id", deleteAccountAddressController);

module.exports = router;
