const express = require("express");
const router = express.Router();
const { getAllController, getByIdController } = require("../controllers/detallepedido");

router.get("/", getAllController);
router.get("/:id", getByIdController);

module.exports = router;
