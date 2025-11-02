const express = require("express");
const router = express.Router();
const {
  getAllController,
  getByIdController,
} = require("../controllers/producto");

router.get("/products", getAllController);
router.get("/products/:id", getByIdController);

module.exports = router;
