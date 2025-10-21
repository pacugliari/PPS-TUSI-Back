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
} = require("../controllers/account");

const { getAllController,getOptionsController,createController,deleteController, updateController} = require("../controllers/cupon");

const { ROLES } = require("../constants/roles");
const { requireAnyRole } = require("../middlewares/preAuthorize");

router.use(
  ["/addresses", "/favorites", "/cards", "/profile", "/orders"],
  requireAnyRole(ROLES.USUARIO)
);

// DIRECCIONES
router.get("/addresses", getAccountAddressesController);
router.get("/addresses/options", getAccountAddressesOptionsController);
router.post("/addresses", postAccountAddressController);
router.put("/addresses/:id", putAccountAddressController);
router.delete("/addresses/:id", deleteAccountAddressController);
router.patch("/addresses/:id/set-primary", setPrimaryAddressController);

// FAVORITOS
router.post("/favorites", getFavoritesController);

// TARJETAS
router.get("/cards", getCardsController);
router.get("/cards/options", getCardsOptionsController);
router.post("/cards", postCardsController);
router.delete("/cards/:id", deleteCardsController);

// PROFILE
router.get("/profile", getProfileController);
router.put("/profile", putProfileController);

// ORDERS
router.get("/orders", getOrdersController);

// ADMIN y OPERARIO
router.use("/coupons", requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO));

router.get("/coupons", getAllController);
router.get("/coupons/options", getOptionsController);
router.post("/coupons", createController);
router.put("/coupons/:id", updateController);
router.delete("/coupons/:id", deleteController);

module.exports = router;
