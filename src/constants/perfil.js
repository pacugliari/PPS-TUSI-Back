const TIPOS_DOCUMENTOS = Object.freeze({
  DNI: "DNI",
  CUIT: "CUIT",
  LE: "LE",
  LC: "LC",
});

const TIPOS_DOCUMENTOS_VALIDOS = Object.values(TIPOS_DOCUMENTOS);

module.exports = { TIPOS_DOCUMENTOS, TIPOS_DOCUMENTOS_VALIDOS };
