const express = require("express");
const router = express.Router();
const {
    getAllController,
    getByIdController,
    createController,
    updateController
} = require("../controllers/cupon");

router.get("/", getAllController);
router.get("/:id", getByIdController);
router.post("/", createController);
router.put("/:id", updateController);

module.exports = router;
