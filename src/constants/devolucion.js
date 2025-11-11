const ESTADOS_DEVOLUCION = Object.freeze({
  REVISION: "revision",
  APROBADO: "aprobado",
  RECHAZADO: "rechazado",
  DEVUELTO: "devuelto"
});

const ESTADOS_VALIDOS = Object.values(ESTADOS_DEVOLUCION);

module.exports = { ESTADOS_DEVOLUCION, ESTADOS_VALIDOS };
