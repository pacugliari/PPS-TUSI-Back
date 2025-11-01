const express = require("express");
const router = express.Router();
const {
  getAllController,
  getByIdController,
  getAllowedTransitionsController,
  transitionController,
} = require("../controllers/pedido");

router.get("/", getAllController);
router.get("/:id", getByIdController);
router.get("/:id/allowed", getAllowedTransitionsController);
router.post("/:id/transition", transitionController);

module.exports = router;
