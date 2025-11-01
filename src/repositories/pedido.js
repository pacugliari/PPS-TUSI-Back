const { Pedido, DetallePedido, Producto, Comentario } = require("../models");

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
      "idPedido",
      ["createdAt", "fecha"],
      "estado",
      "impuestos",
      "subtotal",
      "total",
      "formaPago",
    ],
    order: [["createdAt", "DESC"]],
  });
  return rows.map((r) => r.get({ plain: true }));
}

async function findByIdAndUserWithItems(idPedido, idUsuario) {
  const row = await Pedido.findOne({
    where: { idPedido, idUsuario },
    attributes: [
      "idPedido",
      ["createdAt", "fecha"],
      "estado",
      "impuestos",
      "subtotal",
      "total",
      "formaPago",
      "descuentoCupon",
      "descuentoBanco",
      "porcentajeCupon",
      "porcentajeBanco",
      "costoEnvio",
    ],
    include: [
      {
        model: DetallePedido,
        as: "detalles",
        attributes: ["idDetallePedido", "cantidad", "precio"],
        include: [
          {
            model: Producto,
            as: "producto",
            attributes: ["idProducto", "nombre", "iva"],
            include: [
              {
                model: Comentario,
                as: "comentarios",
                where: { idUsuario },
                required: false,
                attributes: [
                  "idComentario",
                  "puntuacion",
                  "comentario",
                  "createdAt",
                ],
                limit: 1,
                order: [["createdAt", "DESC"]],
              },
            ],
          },
        ],
      },
    ],
  });

  return row ? row.get({ plain: true }) : null;
}

module.exports = {
  findAll,
  findById,
  findByUserId,
  findByIdAndUserWithItems,
};
