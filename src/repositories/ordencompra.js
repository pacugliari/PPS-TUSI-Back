const {
  OrdenCompra,
  ItemOrdenCompra,
  Producto,
  Stock,
  sequelize,
} = require("../models");

const { ESTADOS_ORDEN_COMPRA } = require("../constants/ordencompra");

async function findAll() {
  const rows = await OrdenCompra.findAll({
    attributes: ["idOrdenCompra", ["createdAt", "fecha"], "estado"],
    order: [["createdAt", "DESC"]],
  });

  return rows.map((r) => r.get({ plain: true }));
}

async function findById(idOrdenCompra) {
  const row = await OrdenCompra.findOne({
    where: { idOrdenCompra },
    attributes: ["idOrdenCompra", ["createdAt", "fecha"], "estado"],
    include: [
      {
        model: ItemOrdenCompra,
        as: "items",
        attributes: [
          "idItemOrdenCompra",
          "idProducto",
          "cantidad",
          "cantidadRecibida",
        ],
        include: [
          {
            model: Producto,
            as: "producto",
            attributes: ["idProducto", "nombre", "precio", "iva"],
          },
        ],
      },
    ],
  });

  return row ? row.get({ plain: true }) : null;
}

async function create(items) {
  return sequelize.transaction(async (t) => {
    const orden = await OrdenCompra.create(
      {
        estado: ESTADOS_ORDEN_COMPRA.PENDIENTE,
      },
      { transaction: t }
    );

    for (const it of items) {
      await ItemOrdenCompra.create(
        {
          idOrdenCompra: orden.idOrdenCompra,
          idProducto: it.idProducto,
          cantidad: it.cantidad,
          cantidadRecibida: null,
        },
        { transaction: t }
      );
    }

    return orden.get({ plain: true });
  });
}

async function findPendingProductIds() {
  const rows = await OrdenCompra.findAll({
    where: { estado: ESTADOS_ORDEN_COMPRA.PENDIENTE },
    include: [
      {
        model: ItemOrdenCompra,
        as: "items",
        attributes: ["idProducto"],
      },
    ],
  });

  const ids = [];

  rows.forEach((oc) => {
    oc.items.forEach((it) => {
      if (it.idProducto) ids.push(it.idProducto);
    });
  });

  return ids;
}

async function markAsDelivered(idOrdenCompra, items) {
  return sequelize.transaction(async (t) => {
    for (const it of items) {
      await ItemOrdenCompra.update(
        { cantidadRecibida: it.cantidadRecibida },
        {
          where: {
            idItemOrdenCompra: it.idItemOrdenCompra,
            idOrdenCompra,
          },
          transaction: t,
        }
      );

      const itemDb = await ItemOrdenCompra.findOne({
        where: { idItemOrdenCompra: it.idItemOrdenCompra },
        transaction: t,
      });

      await Stock.increment(
        {
          stockActual: it.cantidadRecibida,
          disponibilidad: it.cantidadRecibida,
        },
        {
          where: { idProducto: itemDb.idProducto },
          transaction: t,
        }
      );
    }

    await OrdenCompra.update(
      { estado: ESTADOS_ORDEN_COMPRA.ENTREGADO },
      { where: { idOrdenCompra }, transaction: t }
    );

    return true;
  });
}

module.exports = {
  findAll,
  findById,
  create,
  findPendingProductIds,
  markAsDelivered,
};
