const pedidoRepository = require("../repositories/pedido");
const HttpError = require("../utils/http-error");

const getAllService = async (req) => {
  const pedidos = await pedidoRepository.findAll();
  return pedidos;
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const pedido = await pedidoRepository.findById(id);

  if (!pedido) {
    throw new HttpError(404, "Pedido no encontrado");
  }

  return pedido;
};

const getOrdersByUserService = async (req) => {
  const idUsuario = req.user.id;
  if (!idUsuario) throw new HttpError(401, "Usuario no autenticado");
  const rows = await pedidoRepository.findByUserId(idUsuario);
  return rows;
};

const getOrderDetailByIdService = async (req) => {
  const idUsuario = req.user.id;
  if (!idUsuario) throw new HttpError(401, "Usuario no autenticado");
  const { id } = req.params;

  const pedido = await pedidoRepository.findByIdAndUserWithItems(id, idUsuario);
  if (!pedido) throw new HttpError(404, "Pedido no encontrado");

  const toNum = (v) => Number.parseFloat(v ?? 0);
  const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

  const items = (pedido.detalles || []).map((d) => {
    const precio = toNum(d.precio);
    const cantidad = toNum(d.cantidad);
    const ivaPct = toNum(d.producto?.iva);
    const factorIVA = 1 + ivaPct / 100;

    const precioConIVA = round2(precio * factorIVA);
    const subtotal = cantidad ? round2(precioConIVA * cantidad) : null;

    return {
      articulo: d.producto?.nombre,
      precio: precioConIVA,
      cantidad,
      subtotal,
    };
  });

  return {
    idPedido: pedido.idPedido,
    items,
    total: pedido.total,
  };
};

module.exports = {
  getAllService,
  getByIdService,
  getOrdersByUserService,
  getOrderDetailByIdService,
};
