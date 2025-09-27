const { ItemOrdenCompra, OrdenCompra, Producto } = require("../models");

async function findAll() {
  const rows = await ItemOrdenCompra.findAll();
  return { rows: rows.map((r) => r.get({ plain: true })) };    
}

async function findById(id) {
  const row = await ItemOrdenCompra.findByPk(id);
  return row ? row.get({ plain: true }) : null;
}

module.exports = {
    findAll,
    findById
};
