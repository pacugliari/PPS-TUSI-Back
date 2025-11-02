const ESTADOS_PEDIDOS = Object.freeze({
  CANCELADO: "cancelado",
  DEVUELTO: "devuelto",
  ENTREGADO: "entregado",
  ENVIADO: "enviado",
  PAGADO: "pagado",
  PENDIENTE: "pendiente",
  RESERVADO: "reservado",
});

const ESTADOS_VALIDOS = Object.values(ESTADOS_PEDIDOS);

const FORMAS_PAGO = Object.freeze({
  EFECTIVO: "efectivo",
  ELECTRONICO: "electronico",
});

const FORMAS_PAGO_VALIDOS = Object.values(FORMAS_PAGO);

module.exports = {
  ESTADOS_PEDIDOS,
  ESTADOS_VALIDOS,
  FORMAS_PAGO,
  FORMAS_PAGO_VALIDOS,
};
