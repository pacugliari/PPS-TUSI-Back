const express = require("express");
const router = express.Router();
const {
  getCheckoutOptionsController,
  validateCardController,
  createPedidoController,
} = require("../controllers/checkout");

router.get("/options", getCheckoutOptionsController);
router.post("/validate-card", validateCardController);
router.post("/order", createPedidoController);

module.exports = router;
