const { Devolucion, Producto, Pedido, Usuario, Perfil } = require("../models");

const findAll = async () => {
  return Devolucion.findAll({
    where: { activo: true },
    include: ["pedido", "producto"],
  });
};

const create = async (data) => {
  return Devolucion.create(data);
};

const remove = async (id) => {
  const devolucion = await Devolucion.findByPk(id);
  if (!devolucion) return null;
  devolucion.activo = false;
  await devolucion.save();
  return devolucion;
};

const findByPedidoId = async (idPedido) => {
  return await Devolucion.findAll({
    where: { idPedido, activo: true },
  });
};

const findAllWithUser = async () => {
  return await Devolucion.findAll({
    where: { activo: true },
    include: [
      {
        model: Producto,
        as: "producto",
        attributes: ["idProducto", "nombre"],
      },
      {
        model: Pedido,
        as: "pedido",
        attributes: ["idPedido"],
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: ["idUsuario", "email"],
            include: [
              {
                model: Perfil,
                as: "perfil",
                attributes: ["nombre", "tipoDocumento", "dni", "telefono"],
              },
            ],
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

const findByUserId = async (idUsuario) => {
  return await Devolucion.findAll({
    where: { activo: true },
    include: [
      {
        model: Producto,
        as: "producto",
        attributes: ["idProducto", "nombre"],
      },
      {
        model: Pedido,
        as: "pedido",
        attributes: ["idPedido"],
        where: { idUsuario },
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

const update = async (id, data, transaction) => {
  const devolucion = await Devolucion.findByPk(id, { transaction });
  if (!devolucion) return null;
  await devolucion.update(data, { transaction });
  return devolucion;
};

const findById = async (id, transaction) => {
  return Devolucion.findOne({
    where: { idDevolucion: id, activo: true },
    include: ["pedido", "producto"],
    transaction,
  });
};

module.exports = {
  findAll,
  findById,
  create,
  remove,
  findAllWithUser,
  findByUserId,
  findByPedidoId,
  update,
};
