const { Stock, Producto } = require("../models");

async function findAll() {
  const rows = await Stock.findAll();
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(id) {
  const row = await Stock.findByPk(id);
  return row ? row.get({ plain: true }) : null;
}

async function findAllWithProducto() {
  const rows = await Stock.findAll({
    include: [
      {
        model: Producto,
        as: "producto",
        attributes: ["idProducto", "nombre"],
        required: true,
      },
    ],
  });
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

module.exports = { findAll, findById, findAllWithProducto };
