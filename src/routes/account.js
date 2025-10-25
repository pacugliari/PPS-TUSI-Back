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
  getOrderDetailController,
  postOrderRateController
} = require("../controllers/account");

const {
  getAllController,
  getOptionsController,
  createController,
  deleteController,
  updateController,
} = require("../controllers/cupon");

const {
  getAllController: getAllZonesController,
  createController: createZonesController,
  deleteController: deleteZonesController,
  updateController: updateZonesController,
} = require("../controllers/zona");

const {
  getAllController: getAllBanksController,
  createController: createBanksController,
  deleteController: deleteBanksController,
  updateController: updateBanksController,
} = require("../controllers/banco");

const {
  getAllController: getAllBrandsController,
  createController: createBrandsController,
  deleteController: deleteBrandsController,
  updateController: updateBrandsController,
} = require("../controllers/marca");

const {
  getAllController: getAllCategoriesController,
  createController: createCategoriesController,
  deleteController: deleteCategoriesController,
  updateController: updateCategoriesController,
} = require("../controllers/categoria");

const {
  getAllController: getAllSubcategoriesController,
  createController: createSubcategoriesController,
  deleteController: deleteSubcategoriesController,
  updateController: updateSubcategoriesController,
  getOptionsController: getSubcategoriesOptionsController,
} = require("../controllers/subcategoria");

const {
  getAllController: getAllFeaturesController,
  createController: createFeaturesController,
  deleteController: deleteFeaturesController,
  updateController: updateFeaturesController,
} = require("../controllers/caracteristica");

const {
  getAllController: getAllBankPromosController,
  createController: createBankPromosController,
  deleteController: deleteBankPromosController,
  updateController: updateBankPromosController,
  getOptionsController: getBankPromosOptionsController,
} = require("../controllers/promocionbancaria");

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
router.get("/orders/:id", getOrderDetailController);
router.post("/orders/:idProducto/rate", postOrderRateController);

// ADMIN y OPERARIO
router.use("/coupons", requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO));

router.get("/coupons", getAllController);
router.get("/coupons/options", getOptionsController);
router.post("/coupons", createController);
router.put("/coupons/:id", updateController);
router.delete("/coupons/:id", deleteController);

router.use("/zones", requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO));

router.get("/zones", getAllZonesController);
router.post("/zones", createZonesController);
router.put("/zones/:id", updateZonesController);
router.delete("/zones/:id", deleteZonesController);

router.use("/banks", requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO));

router.get("/banks", getAllBanksController);
router.post("/banks", createBanksController);
router.put("/banks/:id", updateBanksController);
router.delete("/banks/:id", deleteBanksController);

router.use("/bank-promos", requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO));

router.get("/bank-promos", getAllBankPromosController);
router.get("/bank-promos/options", getBankPromosOptionsController);
router.post("/bank-promos", createBankPromosController);
router.put("/bank-promos/:id", updateBankPromosController);
router.delete("/bank-promos/:id", deleteBankPromosController);

router.use("/brands", requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO));

router.get("/brands", getAllBrandsController);
router.post("/brands", createBrandsController);
router.put("/brands/:id", updateBrandsController);
router.delete("/brands/:id", deleteBrandsController);

router.use("/categories", requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO));

router.get("/categories", getAllCategoriesController);
router.post("/categories", createCategoriesController);
router.put("/categories/:id", updateCategoriesController);
router.delete("/categories/:id", deleteCategoriesController);

router.use("/features", requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO));

router.get("/features", getAllFeaturesController);
router.post("/features", createFeaturesController);
router.put("/features/:id", updateFeaturesController);
router.delete("/features/:id", deleteFeaturesController);

router.use("/subcategories", requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO));

router.get("/subcategories", getAllSubcategoriesController);
router.get("/subcategories/options", getSubcategoriesOptionsController);
router.post("/subcategories", createSubcategoriesController);
router.put("/subcategories/:id", updateSubcategoriesController);
router.delete("/subcategories/:id", deleteSubcategoriesController);

module.exports = router;
