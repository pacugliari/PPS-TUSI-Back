// services/checkout.js
const HttpError = require("../utils/http-error");
const bancoRepository = require("../repositories/banco");
const promocionBancariaRepository = require("../repositories/promocionbancaria");
const tarjetaRepository = require("../repositories/tarjeta");
const cuponRepository = require("../repositories/cupon");
const direccionRepository = require("../repositories/direccion");
const {
  sequelize,
  Pedido,
  DetallePedido,
  Stock,
  Envio,
  Producto,
  Cupon,
} = require("../models");

/** "YYYY-MM-DD" */
const toDateOnly = (d) => {
  if (!d) return null;
  const date = d instanceof Date ? d : new Date(d);
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    .toISOString()
    .slice(0, 10);
};

/** Normaliza: minúsculas + sin tildes + trim */
const norm = (s) =>
  String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

/** Acepta array o string JSON; devuelve array normalizado */
const parseDias = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(norm);
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(norm) : [];
  } catch {
    return [];
  }
};

const compact = (s) => String(s ?? "").replace(/\s+/g, "");

const validateCardService = async (req) => {
  const { cardBrand, last4, cvv } = req.body || {};
  const idUsuario = req.user?.idUsuario ?? req.user?.id ?? null;

  const missing = [
    ...(!idUsuario ? [{ idUsuario: "El ID de usuario es requerido" }] : []),
    ...(!cardBrand
      ? [{ cardBrand: "La marca de la tarjeta es requerida" }]
      : []),
    ...(!last4 ? [{ last4: "Los últimos 4 dígitos son requeridos" }] : []),
    ...(!cvv ? [{ cvv: "El código de seguridad es requerido" }] : []),
  ];
  if (missing.length) {
    throw new HttpError(400, "Faltan campos requeridos").setErrors(missing);
  }

  const tipo = String(cardBrand).trim().toUpperCase();
  const ultimos4 = String(last4).trim();
  const codigo = String(cvv).trim();

  const whereTarjeta = { idUsuario, tipo, codigo, activo: true };
  const tarjeta = await tarjetaRepository.findOne(whereTarjeta);
  if (!tarjeta) {
    throw new HttpError(400, "Tarjeta inválida").setErrors([
      { error: "Tarjeta inválida" },
    ]);
  }

  const numeroCompact = compact(tarjeta.numero);
  if (!numeroCompact || numeroCompact.slice(-4) !== ultimos4) {
    throw new HttpError(400, "Tarjeta inválida").setErrors([
      { error: "Tarjeta inválida" },
    ]);
  }

  const idBanco = tarjeta.idBanco;
  const banco = idBanco ? await bancoRepository.findById(idBanco) : null;

  let promo = null;
  if (banco) {
    const { rows: promosActivas } = await promocionBancariaRepository.findAll();
    const todayStr = toDateOnly(new Date());
    const weekday = norm(
      new Date().toLocaleDateString("es-AR", { weekday: "long" })
    );

    const candidatas = (promosActivas || [])
      .filter((p) => Number(p.banco?.idBanco) === Number(banco.idBanco))
      .filter((p) => {
        const desde = toDateOnly(p.fechaDesde);
        const hasta = toDateOnly(p.fechaHasta);
        const desdeOk = !desde || desde <= todayStr;
        const hastaOk = !hasta || todayStr <= hasta;
        return desdeOk && hastaOk;
      })
      .filter((p) => {
        const dias = parseDias(p.dias);
        return dias.length === 0 ? true : dias.includes(weekday);
      })
      .sort((a, b) => Number(b.porcentaje || 0) - Number(a.porcentaje || 0));

    promo = candidatas[0] || null;
  }

  return {
    idTarjeta: tarjeta.idTarjeta,
    valida: true,
    banco: banco ? { id: Number(banco.idBanco), nombre: banco.nombre } : null,
    promocion: promo
      ? {
          idPromocionBancaria: Number(promo.idPromocionBancaria),
          idBanco: Number(promo.banco?.idBanco ?? banco?.idBanco),
          nombre: promo.nombre,
          fechaDesde: toDateOnly(promo.fechaDesde),
          fechaHasta: toDateOnly(promo.fechaHasta),
          activo: true,
          dias: parseDias(promo.dias),
          porcentaje: Number(promo.porcentaje) || 0,
        }
      : null,
  };
};

/** Calcula el mejor porcentaje de promo vigente para un idTarjeta (si viene) */
async function resolvePromoPercentByCard(idTarjeta, idUsuario) {
  if (!idTarjeta) return 0;

  const tarjeta = await tarjetaRepository.findOne?.({
    idTarjeta: Number(idTarjeta),
    idUsuario: Number(idUsuario),
    activo: true,
  });
  if (!tarjeta) {
    throw new HttpError(403, "Tarjeta no permitida").setErrors([
      { idTarjeta: "La tarjeta no pertenece al usuario o no está activa" },
    ]);
  }

  const banco = tarjeta.idBanco
    ? await bancoRepository.findById(tarjeta.idBanco)
    : null;
  if (!banco) return 0;

  const { rows: promosActivas } = await promocionBancariaRepository.findAll();
  const todayStr = toDateOnly(new Date());
  const weekday = norm(
    new Date().toLocaleDateString("es-AR", { weekday: "long" })
  );

  const candidatas = (promosActivas || [])
    .filter((p) => Number(p.banco?.idBanco) === Number(banco.idBanco))
    .filter((p) => {
      const desde = toDateOnly(p.fechaDesde);
      const hasta = toDateOnly(p.fechaHasta);
      return (!desde || desde <= todayStr) && (!hasta || todayStr <= hasta);
    })
    .filter((p) => {
      const dias = parseDias(p.dias);
      return dias.length === 0 ? true : dias.includes(weekday);
    })
    .sort((a, b) => Number(b.porcentaje || 0) - Number(a.porcentaje || 0));

  return Number(candidatas?.[0]?.porcentaje || 0);
}

/** Busca el porcentaje del cupón si corresponde */
async function resolveCouponPercent(idCupon, idUsuario) {
  if (!idCupon) return 0;

  const cupon = await cuponRepository.findById?.(Number(idCupon));
  if (!cupon) {
    throw new HttpError(404, "Cupón no encontrado").setErrors([
      { idCupon: "Inexistente" },
    ]);
  }
  if (cupon.activo === false) {
    throw new HttpError(400, "Cupón inactivo").setErrors([
      { idCupon: "No se encuentra activo" },
    ]);
  }
  if (cupon.idUsuario && Number(cupon.idUsuario) !== Number(idUsuario)) {
    throw new HttpError(403, "Cupón no permitido").setErrors([
      { idCupon: "El cupón no pertenece al usuario" },
    ]);
  }

  const today = toDateOnly(new Date());
  const desdeOk = !cupon.fechaDesde || toDateOnly(cupon.fechaDesde) <= today;
  const hastaOk = !cupon.fechaHasta || today <= toDateOnly(cupon.fechaHasta);
  if (!desdeOk || !hastaOk) {
    throw new HttpError(400, "Cupón fuera de vigencia").setErrors([
      { idCupon: "Fuera de rango de fechas" },
    ]);
  }

  return Number(cupon.porcentaje || 0);
}

async function assertAddressOwnership(idDireccion, idUsuario) {
  if (!idDireccion) return null;
  const dir = await direccionRepository.findById?.(Number(idDireccion));
  if (!dir) {
    throw new HttpError(404, "Dirección no encontrada").setErrors([
      { idDireccion: "Inexistente" },
    ]);
  }
  if (Number(dir.idUsuario) !== Number(idUsuario)) {
    throw new HttpError(403, "Dirección no permitida").setErrors([
      { idDireccion: "La dirección no pertenece al usuario" },
    ]);
  }
  return dir;
}

/**
 * Crea un pedido con líneas, gestiona stock y envío.
 * Body: { formaPago: 'efectivo'|'electronico', productos:[{idProducto,cantidad}], idTarjeta?, idDireccion?, idCupon? }
 * Regla stock:
 *  - efectivo: stockActual -= qty, reservado += qty
 *  - electronico: stockActual -= qty, comprometido += qty
 * Estado inicial:
 *  - efectivo: 'reservado'
 *  - electronico: 'pagado'
 */
const createOrderService = async (req) => {
  const idUsuario = req.user?.id ?? req.user?.idUsuario ?? null;
  const { formaPago, productos, idTarjeta, idDireccion, idCupon } =
    req.body || {};

  const missing = [
    ...(!idUsuario ? [{ idUsuario: "El ID de usuario es requerido" }] : []),
    ...(!formaPago ? [{ formaPago: "La forma de pago es requerida" }] : []),
    ...(!Array.isArray(productos) || productos.length === 0
      ? [{ productos: "Debe enviar al menos un producto" }]
      : []),
  ];
  if (missing.length)
    throw new HttpError(400, "Faltan campos requeridos").setErrors(missing);

  const fp = String(formaPago).toLowerCase();
  if (!["efectivo", "electronico"].includes(fp)) {
    throw new HttpError(400, "Forma de pago inválida").setErrors([
      { formaPago: "Valor inválido" },
    ]);
  }

  return await sequelize.transaction(async (tx) => {
    const ids = productos.map((p) => Number(p.idProducto));
    const rowsProd = await Producto.findAll({
      where: { idProducto: ids },
      transaction: tx,
      lock: tx.LOCK.UPDATE,
    });
    if (rowsProd.length !== ids.length)
      throw new HttpError(400, "Productos inválidos");

    const mapProd = new Map(rowsProd.map((r) => [Number(r.idProducto), r]));
    const rowsStock = await Stock.findAll({
      where: { idProducto: ids },
      transaction: tx,
      lock: tx.LOCK.UPDATE,
    });
    const mapStock = new Map(rowsStock.map((r) => [Number(r.idProducto), r]));
    if (mapStock.size !== ids.length)
      throw new HttpError(400, "Stock no disponible");

    const couponPercent = await resolveCouponPercent(idCupon, idUsuario);
    const promoPercent = await resolvePromoPercentByCard(idTarjeta, idUsuario);
    const dir = await assertAddressOwnership(idDireccion, idUsuario);
    const costoEnvio = dir ? Number(dir.zona?.costoEnvio ?? 300) : 0;

    // Cálculos acumulados
    let subtotalNeto = 0;
    let impuestoTotal = 0;
    let descuentoCuponTotal = 0;
    let descuentoBancoTotal = 0;

    // 🔹 Primero creamos el pedido con totales iniciales 0
    const pedido = await Pedido.create(
      {
        idUsuario,
        fecha: new Date(),
        estado: fp === "efectivo" ? "reservado" : "pagado",
        subtotal: 0,
        impuestos: 0,
        descuentoCupon: 0,
        descuentoBanco: 0,
        costoEnvio,
        porcentajeCupon: couponPercent,
        porcentajeBanco: promoPercent,
        total: 0,
        formaPago: fp,
      },
      { transaction: tx }
    );

    // 🔹 Insertamos los detalles
    for (const line of productos) {
      const prod = mapProd.get(Number(line.idProducto));
      const stk = mapStock.get(Number(line.idProducto));
      const qty = Number(line.cantidad || 0);
      if (!prod || !stk || qty <= 0) throw new HttpError(400, "Línea inválida");

      const disponibilidad =
        Number(stk.stockActual || 0) -
        Number(stk.reservado || 0) -
        Number(stk.comprometido || 0);
      if (qty > disponibilidad) throw new HttpError(400, "Stock insuficiente");

      const precioNeto = Number(prod.precio || 0);
      const ivaPct = Number(prod.iva || 0);

      const neto = precioNeto * qty;
      const descCupon = couponPercent > 0 ? (neto * couponPercent) / 100 : 0;
      const baseTrasCupon = Math.max(0, neto - descCupon);
      const descPromo =
        promoPercent > 0 ? (baseTrasCupon * promoPercent) / 100 : 0;
      const baseFinal = Math.max(0, baseTrasCupon - descPromo);
      const ivaMonto = baseFinal * (ivaPct / 100);

      subtotalNeto += baseFinal;
      impuestoTotal += ivaMonto;
      descuentoCuponTotal += descCupon;
      descuentoBancoTotal += descPromo;

      await DetallePedido.create(
        {
          idPedido: pedido.idPedido,
          idProducto: prod.idProducto,
          cantidad: qty,
          precio: precioNeto,
          iva: ivaPct,
          subtotal: baseFinal.toFixed(2),
        },
        { transaction: tx }
      );
    }

    const total = subtotalNeto + impuestoTotal + costoEnvio;

    // 🔹 Actualizamos totales del pedido
    await pedido.update(
      {
        subtotal: subtotalNeto.toFixed(2),
        impuestos: impuestoTotal.toFixed(2),
        descuentoCupon: descuentoCuponTotal.toFixed(2),
        descuentoBanco: descuentoBancoTotal.toFixed(2),
        total: total.toFixed(2),
      },
      { transaction: tx }
    );

    // 🔹 Cupon usado → inactivo
    if (idCupon != null && !isNaN(Number(idCupon))) {
      const cupon = await cuponRepository.findById(Number(idCupon));
      if (cupon && cupon.activo === true) {
        await cuponRepository.update(Number(idCupon), { activo: false });
      }
    }

    // 🔹 Envío
    if (idDireccion) {
      await Envio.create(
        {
          idPedido: pedido.idPedido,
          idDireccion: Number(idDireccion),
          precio: costoEnvio.toFixed(2),
        },
        { transaction: tx }
      );
    }

    // 🔹 Stock
    for (const line of productos) {
      const stk = mapStock.get(Number(line.idProducto));
      const qty = Number(line.cantidad || 0);
      const stockActual = Number(stk.stockActual || 0) - qty;
      const reservado =
        Number(stk.reservado || 0) + (fp === "efectivo" ? qty : 0);
      const comprometido =
        Number(stk.comprometido || 0) + (fp === "electronico" ? qty : 0);
      const disponibilidad = stockActual - reservado - comprometido;

      await stk.update(
        { stockActual, reservado, comprometido, disponibilidad },
        { transaction: tx }
      );
    }

    return {
      idPedido: pedido.idPedido,
      estado: pedido.estado,
      subtotal: pedido.subtotal,
      impuestos: pedido.impuestos,
      descuentoCupon: pedido.descuentoCupon,
      descuentoBanco: pedido.descuentoBanco,
      costoEnvio: pedido.costoEnvio,
      total: pedido.total,
    };
  });
};

module.exports = {
  validateCardService,
  createOrderService,
};
