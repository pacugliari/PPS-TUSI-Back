const pedidoRepository = require("../repositories/pedido");
const HttpError = require("../utils/http-error");
const { sequelize, Pedido } = require("../models");
const { OrderFSM } = require("../domain/pedidos/fsm");
const { ESTADOS_DEVOLUCION } = require("../constants/devolucion");
const adaptPedido = (pedido) => {
  const toNum = (v) => {
    const n = Number.parseFloat(v ?? 0);
    return Number.isFinite(n) ? n : 0;
  };
  const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

  const items = (pedido.detalles || []).map((d) => {
    const cantidad = toNum(d.cantidad);
    const precioUnit = toNum(d.producto?.precio ?? d.precio);
    const ivaPct = toNum(d.producto?.iva);
    const subtotalItem = round2(precioUnit * cantidad);

    const opinion = d.producto?.comentarios?.[0] || null;

    const devolucionActiva = (d.producto?.devoluciones || []).some(
      (dev) => dev.activo === true
    );

    return {
      idProducto: d.producto?.idProducto,
      articulo: d.producto?.nombre,
      precio: round2(precioUnit),
      cantidad,
      subtotal: subtotalItem,
      calificado: !!opinion,
      enDevolucion: devolucionActiva,
      iva: ivaPct,
    };
  });

  const subtotalBruto = round2(
    items.reduce((acc, it) => acc + toNum(it.subtotal), 0)
  );

  const baseImponible = round2(toNum(pedido.subtotal));
  const impuestos = round2(toNum(pedido.impuestos));
  const costoEnvio = round2(toNum(pedido.costoEnvio));
  const total = round2(toNum(pedido.total));

  return {
    idPedido: pedido.idPedido,
    estado: pedido.estado,
    items,
    subtotalBruto,
    baseImponible,
    impuestos,
    descuentoCupon: round2(toNum(pedido.descuentoCupon)),
    descuentoBanco: round2(toNum(pedido.descuentoBanco)),
    costoEnvio,
    total,
    porcentajeCupon: round2(toNum(pedido.porcentajeCupon)),
    porcentajeBanco: round2(toNum(pedido.porcentajeBanco)),
  };
};

const getAllService = async (req) => {
  const pedidos = await pedidoRepository.findAll(req);
  return pedidos.rows;
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const pedido = await pedidoRepository.findById(id);
  if (!pedido) throw new HttpError(404, "Pedido no encontrado");
  return adaptPedido(pedido);
};

const getOrdersByUserService = async (req) => {
  const idUsuario = req.user?.id;
  if (!idUsuario) throw new HttpError(401, "Usuario no autenticado");
  const rows = await pedidoRepository.findByUserId(idUsuario);
  return rows;
};

const getOrderDetailByIdService = async (req) => {
  const idUsuario = req.user?.id;
  if (!idUsuario) throw new HttpError(401, "Usuario no autenticado");
  const { id } = req.params;

  const pedido = await pedidoRepository.findByIdAndUserWithItems(id, idUsuario);
  if (!pedido) throw new HttpError(404, "Pedido no encontrado");

  return adaptPedido(pedido);
};

const getAllowedTransitionsService = async (req) => {
  const { id } = req.params;
  const instance = await Pedido.findByPk(id);
  if (!instance) throw new HttpError(404, "Pedido no encontrado");

  const fsm = new OrderFSM(instance, null);
  return { estado: instance.estado, allowed: fsm.state.allowed() };
};

const transitionService = async (req) => {
  const { id } = req.params;
  const { to } = req.body || {};
  if (!to) throw new HttpError(400, "Estado destino requerido");

  return await sequelize.transaction(async (tx) => {
    const instance = await Pedido.findByPk(id, {
      transaction: tx,
      lock: tx.LOCK.UPDATE,
    });
    if (!instance) throw new HttpError(404, "Pedido no encontrado");

    const fsm = new OrderFSM(instance, tx);
    const updated = await fsm.transition(String(to).toLowerCase());
    return updated;
  });
};

module.exports = {
  getAllService,
  getByIdService,
  getOrdersByUserService,
  getOrderDetailByIdService,
  getAllowedTransitionsService,
  transitionService,
};
