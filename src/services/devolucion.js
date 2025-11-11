const devolucionRepository = require("../repositories/devolucion");
const pedidoRepository = require("../repositories/pedido");
const productoRepository = require("../repositories/producto");
const HttpError = require("../utils/http-error");
const { ESTADOS_DEVOLUCION } = require("../constants/devolucion");
const { sequelize, Pedido, DetallePedido } = require("../models");
const { OrderFSM } = require("../domain/pedidos/fsm");

const getAllService = async (req) => {
  const devoluciones = await devolucionRepository.findAllWithUser();
  return devoluciones;
};

const getByUserService = async (req) => {
  const idUsuario = req.user?.id;
  if (!idUsuario) throw new HttpError(401, "Usuario no autenticado");

  const devoluciones = await devolucionRepository.findByUserId(idUsuario);
  return devoluciones;
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const devolucion = await devolucionRepository.findById(id);

  if (!devolucion || !devolucion.activo) {
    throw new HttpError(404, "Devolución no encontrada o inactiva");
  }

  return devolucion;
};

const createService = async (req) => {
  const { idPedido, idProducto } = req.params;
  const { motivo, comentario } = req.body;
  const idUsuario = req.user?.id;

  if (!motivo) {
    throw new HttpError(400, "El motivo de la devolución es obligatorio");
  }

  const pedido = await pedidoRepository.findById(idPedido);
  if (!pedido) throw new HttpError(404, "Pedido no encontrado");

  const producto = await productoRepository.findById(idProducto);
  if (!producto) throw new HttpError(404, "Producto no encontrado");

  const devolucion = await devolucionRepository.create({
    idPedido,
    idProducto,
    idUsuario,
    motivo,
    comentario: comentario || null,
    fecha: new Date(),
    estado: "revision",
    activo: true,
  });

  return devolucion;
};

const updateService = async (req) => {
  const { id } = req.params;
  const { motivo, comentario, estado, activo } = req.body;

  const devolucion = await devolucionRepository.findById(id);
  if (!devolucion || devolucion.activo === false) {
    throw new HttpError(404, "Devolución no encontrada");
  }

  if (
    motivo === undefined &&
    comentario === undefined &&
    estado === undefined &&
    activo === undefined
  ) {
    throw new HttpError(400, "No hay campos para actualizar");
  }

  if (estado && !Object.values(ESTADOS_DEVOLUCION).includes(estado)) {
    throw new HttpError(400, "Estado de devolución inválido");
  }

  const updated = await devolucionRepository.update(id, {
    ...(motivo !== undefined && { motivo }),
    ...(comentario !== undefined && { comentario }),
    ...(estado !== undefined && { estado }),
    ...(activo !== undefined && { activo }),
  });

  return updated;
};

const approveService = async (req) => {
  const { id } = req.params;
  const devolucion = await devolucionRepository.findById(id);

  if (!devolucion || !devolucion.activo) {
    throw new HttpError(404, "Devolución no encontrada o inactiva");
  }

  return await devolucionRepository.update(id, {
    estado: ESTADOS_DEVOLUCION.APROBADO,
  });
};

const rejectService = async (req) => {
  const { id } = req.params;
  const devolucion = await devolucionRepository.findById(id);

  if (!devolucion || !devolucion.activo) {
    throw new HttpError(404, "Devolución no encontrada o inactiva");
  }

  return await devolucionRepository.update(id, {
    estado: ESTADOS_DEVOLUCION.RECHAZADO,
  });
};

const deleteService = async (req) => {
  const { id } = req.params;
  const devolucion = await devolucionRepository.remove(id);
  if (!devolucion) throw new HttpError(404, "Devolución no encontrada");
  return devolucion;
};

const confirmService = async (req) => {
  const { id } = req.params;

  return await sequelize.transaction(async (tx) => {
    const devolucion = await devolucionRepository.findById(id, tx);
    if (!devolucion || devolucion.activo === false) {
      throw new HttpError(404, "Devolución no encontrada");
    }

    if (devolucion.estado !== ESTADOS_DEVOLUCION.APROBADO) {
      throw new HttpError(
        400,
        "Solo pueden confirmarse devoluciones aprobadas"
      );
    }

    await devolucionRepository.update(
      id,
      { estado: ESTADOS_DEVOLUCION.DEVUELTO },
      tx
    );

    const idPedido = devolucion.idPedido;

    const pedido = await Pedido.findByPk(idPedido, {
      include: [
        {
          model: DetallePedido,
          as: "detalles",
          attributes: ["idProducto"],
        },
      ],
      transaction: tx,
    });

    if (!pedido || !pedido.detalles?.length) {
      throw new HttpError(404, "Pedido o productos no encontrados");
    }

    const productosPedido = pedido.detalles.map((d) => d.idProducto);

    const devoluciones = await devolucionRepository.findByPedidoId(
      idPedido,
      tx
    );

    const todosLosProductosDevueltos = productosPedido.every((idProd) => {
      const dev = devoluciones.find((d) => d.idProducto === idProd);
      if (!dev) return false;
      const estadoActual =
        dev.idDevolucion === devolucion.idDevolucion
          ? ESTADOS_DEVOLUCION.DEVUELTO
          : dev.estado;
      return estadoActual === ESTADOS_DEVOLUCION.DEVUELTO;
    });

    if (todosLosProductosDevueltos) {
      const fsm = new OrderFSM(pedido, tx);
      await fsm.transition("devuelto");
    }

    return devolucion;
  });
};

module.exports = {
  getAllService,
  getByUserService,
  getByIdService,
  createService,
  updateService,
  approveService,
  rejectService,
  deleteService,
  confirmService,
};
