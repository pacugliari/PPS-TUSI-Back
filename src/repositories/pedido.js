const {
  Pedido,
  DetallePedido,
  Producto,
  Comentario,
  Usuario,
  Perfil,
  Devolucion,
} = require("../models");

async function findAll() {
  const rows = await Pedido.findAll({
    where: { activo: true },
    include: [
      {
        model: Usuario,
        as: "usuario",
        attributes: ["idUsuario", "compraOnline", "email"],
        include: [
          {
            model: Perfil,
            as: "perfil",
            attributes: [
              "idPerfil",
              "nombre",
              "tipoDocumento",
              "dni",
              "telefono",
            ],
          },
        ],
      },
    ],
    attributes: { exclude: ["activo"] },
  });
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(idPedido) {
  const row = await Pedido.findOne({
    where: { idPedido },
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
          },
        ],
      },
    ],
  });
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
              {
                model: Devolucion,
                as: "devoluciones",
                required: false,
                where: {
                  idPedido,
                  activo: true,
                },
                attributes: [
                  "idDevolucion",
                  "motivo",
                  "comentario",
                  "estado",
                  "activo",
                  "fecha",
                ],
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
