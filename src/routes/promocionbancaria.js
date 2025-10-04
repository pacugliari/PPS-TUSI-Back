const express = require("express");
const router = express.Router();
const {
    getAllController,
    getByIdController,
    createController,
    updateController,
    deleteController
} = require("../controllers/promocionbancaria");


router.get("/", getAllController);
router.get("/:id", getByIdController);
router.post("/", createController);
router.put("/:id", updateController);
router.delete("/:id", deleteController);

module.exports = router;
