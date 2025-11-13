const express = require("express");
const router = express.Router();
const { createMulterMemory } = require("../utils/multer.factory");
const uploadFotos = createMulterMemory({ fileSizeMB: 5, fileCount: 3 });

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
  getPurchasesController,
  getPurchasesDetailController,
  postPurchasesRateController,
  postPurchasesReturnController,
  getOrdersController,
  getOrderDetailController,
  getProductsController,
  getProductsOptionsController,
  postProductController,
  putProductController,
  deleteProductController,
  postOrdersCancelController,
  postOrdersSentController,
  postOrdersDeliveredController,
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

const {
  getAllController: getAllCarouselPrincipalController,
  createController: createCarouselPrincipalController,
  updateController: updateCarouselPrincipalController,
  deleteController: deleteCarouselPrincipalController,
} = require("../controllers/carrusel_principal");

const {
  getAllController: getAllCarouselMarcasController,
  createController: createCarouselMarcasController,
  updateController: updateCarouselMarcasController,
  deleteController: deleteCarouselMarcasController,
} = require("../controllers/carrusel_marcas");

const { ROLES } = require("../constants/roles");
const { requireAnyRole } = require("../middlewares/preAuthorize");

router.use(
  ["/addresses", "/favorites", "/cards", "/profile", "/purchases"],
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

// RETURNS
const {
  getAllController: getAllReturnsController,
  getUserController: getUserReturnsController,
  approveController: approveReturnController,
  rejectController: rejectReturnController,
  confirmController: confirmReturnController,
} = require("../controllers/devolucion");

// PURCHASES
router.get("/purchases", getPurchasesController);
router.get("/purchases/:id", getPurchasesDetailController);
router.post("/purchases/:idProducto/rate", postPurchasesRateController);
router.post(
  "/purchases/:idPedido/returns/:idProducto",
  postPurchasesReturnController
);

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

router.use("/products", requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO));

router.get("/products", getProductsController);
router.get("/products/options", getProductsOptionsController);
router.post("/products", uploadFotos.array("fotos", 3), postProductController);
router.put(
  "/products/:id",
  uploadFotos.array("fotos", 3),
  putProductController
);
router.delete("/products/:id", deleteProductController);

router.use(
  "/orders",
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO, ROLES.DELIVERY)
);
router.get("/orders", getOrdersController);
router.get("/orders/:id", getOrderDetailController);
router.post("/orders/cancel/:id", postOrdersCancelController);
router.post("/orders/sent/:id", postOrdersSentController);
router.post("/orders/delivered/:id", postOrdersDeliveredController);

router.use("/returns/user", requireAnyRole(ROLES.USUARIO));
router.get("/returns/user", getUserReturnsController);

router.use("/returns/admin", requireAnyRole(ROLES.ADMIN));
router.get("/returns/admin", getAllReturnsController);
router.patch("/returns/admin/:id/approve", approveReturnController);
router.patch("/returns/admin/:id/reject", rejectReturnController);
router.patch("/returns/admin/:id/confirm", confirmReturnController);

router.use("/carousel-principal", requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO));

router.get("/carousel-principal", getAllCarouselPrincipalController);
router.post(
  "/carousel-principal",
  uploadFotos.single("foto"),
  createCarouselPrincipalController
);
router.put(
  "/carousel-principal/:id",
  uploadFotos.single("foto"),
  updateCarouselPrincipalController
);
router.delete("/carousel-principal/:id", deleteCarouselPrincipalController);

router.use("/carousel-marcas", requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO));

router.get("/carousel-marcas", getAllCarouselMarcasController);
router.post(
  "/carousel-marcas",
  uploadFotos.single("foto"),
  createCarouselMarcasController
);
router.put(
  "/carousel-marcas/:id",
  uploadFotos.single("foto"),
  updateCarouselMarcasController
);
router.delete("/carousel-marcas/:id", deleteCarouselMarcasController);

module.exports = router;
