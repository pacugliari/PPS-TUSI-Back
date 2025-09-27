const { Devolucion, Pedido, Producto } = require("../models");

async function findAll() {
  const rows = await Devolucion.findAll();
  return { rows: rows.map((r) => r.get({ plain: true })) };    
}

async function findById(id) {
  const row = await Devolucion.findByPk(id);
  return row ? row.get({ plain: true }) : null;
}

module.exports = {
    findAll,
    findById
};
