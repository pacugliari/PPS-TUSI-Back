const { OrdenCompra, Usuario, ItemOrdenCompra, Producto } = require("../models");

async function findAll() {
  const rows = await OrdenCompra.findAll();
  return { rows: rows.map((r) => r.get({ plain: true })) };    
}

async function findById(id) {
  const row = await OrdenCompra.findByPk(id);
  return row ? row.get({ plain: true }) : null;
}

module.exports = {
    findAll,
    findById
};
