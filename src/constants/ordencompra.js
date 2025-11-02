const ESTADOS_ORDEN_COMPRA = Object.freeze({
  ENTREGADO: "entregado",
  PENDIENTE: "pendiente",
});

const ESTADOS_VALIDOS = Object.values(ESTADOS_ORDEN_COMPRA);

module.exports = { ESTADOS_ORDEN_COMPRA, ESTADOS_VALIDOS };
