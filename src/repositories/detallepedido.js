const { DetallePedido, Pedido, Producto } = require("../models");

async function findAll() {
  const rows = await DetallePedido.findAll({
    include: [
      { model: Pedido, as: "pedido" },
      { model: Producto, as: "producto", attributes: ['idProducto', 'nombre'] }
    ]
  });
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(id) {
  const row = await DetallePedido.findByPk(id, {
    include: [
      { model: Pedido, as: "pedido" },
      { model: Producto, as: "producto", attributes: ['idProducto', 'nombre'] }
    ]
  });
  return row ? row.get({ plain: true }) : null;
}

module.exports = { findAll, findById };
