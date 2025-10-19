const { Pedido, Usuario, DetallePedido, Producto, Envio, Direccion } = require("../models");

async function findAll() {
  const rows = await Pedido.findAll();
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(id) {
  const row = await Pedido.findByPk(id);
  return row ? row.get({ plain: true }) : null;
}

async function findByUserId(idUsuario) {
  const rows = await Pedido.findAll({
    where: { idUsuario },
    attributes: [
      'idPedido',
      ['createdAt', 'fecha'],
      'estado',
      'impuestos',
      'subtotal',
      'total',
      'formaPago'
    ],
    order: [['createdAt', 'DESC']]
  });
  return rows.map(r => r.get({ plain: true }));
}

module.exports = {
  findAll,
  findById,
  findByUserId
};
