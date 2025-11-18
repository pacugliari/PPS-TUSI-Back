const ordenCompraRepository = require("../repositories/ordencompra");
const productoRepository = require("../repositories/producto");
const HttpError = require("../utils/http-error");
const { ESTADOS_ORDEN_COMPRA } = require("../constants/ordencompra");

const adaptOrdenCompra = (orden) => {
  const estado = String(orden.estado).toLowerCase();

  const toNum = (v) => {
    const n = Number.parseFloat(v ?? 0);
    return Number.isFinite(n) ? n : 0;
  };

  const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

  const items = (orden.items || []).map((it) => ({
    idItemOrdenCompra: it.idItemOrdenCompra,
    idProducto: it.producto?.idProducto,
    nombre: it.producto?.nombre,
    precio: toNum(it.producto?.precio),
    cantidad: toNum(it.cantidad),
    cantidadRecibida: it.cantidadRecibida ?? null,
    iva: toNum(it.producto?.iva ?? 21),
    subtotal: round2(toNum(it.producto?.precio) * toNum(it.cantidad)),
  }));

  const subtotalBruto = round2(items.reduce((acc, it) => acc + it.subtotal, 0));
  const impuestos = round2(
    items.reduce((acc, it) => acc + it.subtotal * (it.iva / 100), 0)
  );
  const total = round2(subtotalBruto + impuestos);

  return {
    idOrdenCompra: orden.idOrdenCompra,
    fecha: orden.fecha,
    estado,
    items,
    subtotalBruto,
    impuestos,
    total,
  };
};

const getAllService = async () => {
  return await ordenCompraRepository.findAll();
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const orden = await ordenCompraRepository.findById(id);

  if (!orden) throw new HttpError(404, "Orden de compra no encontrada");

  return adaptOrdenCompra(orden);
};

const createService = async (req) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new HttpError(400, "Debe enviar al menos 1 item");
  }

  const productosValidos = [];

  for (const item of items) {
    if (!item.idProducto) {
      throw new HttpError(400, "Cada item debe incluir idProducto");
    }

    if (item.cantidad == null) {
      throw new HttpError(
        400,
        `Debe enviar cantidad para el producto ${item.idProducto}`
      );
    }

    const cantidad = Number(item.cantidad);
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      throw new HttpError(
        400,
        `La cantidad del producto ${item.idProducto} debe ser mayor a 0`
      );
    }

    const producto = await productoRepository.findById(item.idProducto);
    if (!producto) {
      throw new HttpError(
        404,
        `El producto con id ${item.idProducto} no existe`
      );
    }

    productosValidos.push({
      idProducto: item.idProducto,
      cantidad,
    });
  }

  const ids = productosValidos.map((i) => i.idProducto);
  const repetidos = ids.filter((id, idx) => ids.indexOf(id) !== idx);

  if (repetidos.length > 0) {
    throw new HttpError(
      400,
      `Existen productos duplicados en la orden: ${[...new Set(repetidos)].join(
        ", "
      )}`
    );
  }

  const orden = await ordenCompraRepository.create(productosValidos);

  return {
    idOrdenCompra: orden.idOrdenCompra,
    fecha: orden.fecha,
  };
};

const markDeliveredService = async (req) => {
  const { id } = req.params;
  const { items } = req.body;

  if (!Array.isArray(items)) {
    throw new HttpError(400, "Formato de items inválido");
  }

  const orden = await ordenCompraRepository.findById(id);
  if (!orden) throw new HttpError(404, "Orden de compra no encontrada");

  const estado = String(orden.estado).toLowerCase();

  if (estado !== ESTADOS_ORDEN_COMPRA.PENDIENTE) {
    throw new HttpError(400, "Solo se pueden entregar órdenes pendientes");
  }

  for (const it of items) {
    if (!it.idItemOrdenCompra) {
      throw new HttpError(400, "Cada item debe incluir idItemOrdenCompra");
    }

    const itemOriginal = orden.items.find(
      (o) => o.idItemOrdenCompra === it.idItemOrdenCompra
    );

    if (!itemOriginal) {
      throw new HttpError(
        400,
        `El item ${it.idItemOrdenCompra} no pertenece a esta orden`
      );
    }

    const cantidadRecibida = Number(it.cantidadRecibida);

    if (!Number.isFinite(cantidadRecibida) || cantidadRecibida < 0) {
      throw new HttpError(
        400,
        `Cantidad inválida para item ${it.idItemOrdenCompra}`
      );
    }

    if (cantidadRecibida > Number(itemOriginal.cantidad)) {
      throw new HttpError(
        400,
        `La cantidad recibida (${cantidadRecibida}) no puede superar la pedida (${itemOriginal.cantidad})`
      );
    }
  }

  await ordenCompraRepository.markAsDelivered(id, items);

  return { delivered: true };
};

module.exports = {
  getAllService,
  getByIdService,
  createService,
  markDeliveredService,
};
