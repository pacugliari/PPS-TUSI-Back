const express = require("express");
const router = express.Router();
const bancoService = require("../services/banco");

router.get("/", async (req, res, next) => {
  try {
    const bancos = await bancoService.getAllService(req);
    res.json(bancos);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const result = await bancoService.getByIdService(req);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
