const HttpError = require("../utils/http-error");
const promocionBancariaRepository = require("../repositories/promocionbancaria");
const bancoRepository = require("../repositories/banco");

const DIAS_VALIDOS = [
  "lunes","martes","miercoles","jueves","viernes","sabado","domingo",
];

const getAllService = async () => {
  try {
    const { rows } = await promocionBancariaRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener las promociones bancarias");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const promo = await promocionBancariaRepository.findById(id);
  if (!promo || promo.activo === false) {
    throw new HttpError(404, "Promoción bancaria no encontrada");
  }
  return { data: promo };
};

const createService = async (req) => {
  const { idBanco, nombre, fechaDesde, fechaHasta, dias, porcentaje } = req.body;

  if (
    !idBanco || !nombre || !fechaDesde || !fechaHasta ||
    !dias || porcentaje === undefined || porcentaje === null
  ) {
    throw new HttpError(400, "Faltan campos requeridos").setErrors([
      ...(!idBanco ? [{ idBanco: "El banco es requerido" }] : []),
      ...(!nombre ? [{ nombre: "El nombre es requerido" }] : []),
      ...(!fechaDesde ? [{ fechaDesde: "La fecha desde es requerida" }] : []),
      ...(!fechaHasta ? [{ fechaHasta: "La fecha hasta es requerida" }] : []),
      ...(!dias ? [{ dias: "Los días son requeridos" }] : []),
      ...(porcentaje === undefined || porcentaje === null
        ? [{ porcentaje: "El porcentaje es requerido" }]
        : []),
    ]);
  }

  if (new Date(fechaHasta) < new Date(fechaDesde)) {
    throw new HttpError(400, "Fechas inválidas").setErrors([
      { fechas: "La fecha hasta debe ser posterior a la fecha desde" },
    ]);
  }

  if (!Array.isArray(dias) || !dias.every((d) => DIAS_VALIDOS.includes(d))) {
    throw new HttpError(400, "Días inválidos").setErrors([
      { dias: "Los días deben ser un array con valores válidos: lunes, martes, etc." },
    ]);
  }

  const pct = Number(porcentaje);
  if (Number.isNaN(pct) || pct < 0 || pct > 100) {
    throw new HttpError(400, "Porcentaje inválido").setErrors([
      { porcentaje: "Debe ser un número entre 0 y 100" },
    ]);
  }

  const promo = await promocionBancariaRepository.create({
    idBanco,
    nombre,
    fechaDesde,
    fechaHasta,
    dias,
    porcentaje: pct,
    activo: true,
  });

  return { data: promo };
};

const updateService = async (req) => {
  const { id } = req.params;
  const {
    idBanco, nombre, fechaDesde, fechaHasta, dias, porcentaje, activo
  } = req.body;

  const actual = await promocionBancariaRepository.findById(id);
  if (!actual || actual.activo === false) {
    throw new HttpError(404, "Promoción bancaria no encontrada");
  }

  if (
    idBanco === undefined && nombre === undefined &&
    fechaDesde === undefined && fechaHasta === undefined &&
    dias === undefined && porcentaje === undefined &&
    activo === undefined
  ) {
    throw new HttpError(400, "No hay campos para actualizar").setErrors([
      { body: "Debe proporcionar al menos un campo para actualizar" },
    ]);
  }

  if (fechaDesde !== undefined || fechaHasta !== undefined) {
    const desde = fechaDesde ?? actual.fechaDesde;
    const hasta = fechaHasta ?? actual.fechaHasta;
    if (new Date(hasta) < new Date(desde)) {
      throw new HttpError(400, "Fechas inválidas").setErrors([
        { fechas: "La fecha hasta debe ser posterior a la fecha desde" },
      ]);
    }
  }

  if (dias !== undefined) {
    if (!Array.isArray(dias) || !dias.every((d) => DIAS_VALIDOS.includes(d))) {
      throw new HttpError(400, "Días inválidos").setErrors([
        { dias: "Los días deben ser un array con valores válidos: lunes, martes, etc." },
      ]);
    }
  }

  let pctUpdate;
  if (porcentaje !== undefined) {
    const pct = Number(porcentaje);
    if (Number.isNaN(pct) || pct < 0 || pct > 100) {
      throw new HttpError(400, "Porcentaje inválido").setErrors([
        { porcentaje: "Debe ser un número entre 0 y 100" },
      ]);
    }
    pctUpdate = pct;
  }

  const updated = await promocionBancariaRepository.update(id, {
    ...(idBanco !== undefined && { idBanco }),
    ...(nombre !== undefined && { nombre }),
    ...(fechaDesde !== undefined && { fechaDesde }),
    ...(fechaHasta !== undefined && { fechaHasta }),
    ...(dias !== undefined && { dias }),
    ...(pctUpdate !== undefined && { porcentaje: pctUpdate }),
    ...(activo !== undefined && { activo }),
  });

  return { data: updated };
};

const deleteService = async (req) => {
  const { id } = req.params;
  const promo = await promocionBancariaRepository.findById(id);
  if (!promo || promo.activo === false) {
    throw new HttpError(404, "Promoción bancaria no encontrada");
  }
  const updated = await promocionBancariaRepository.update(id, { activo: false });
  return { data: updated };
};

const getOptionsService = async () => {
  try {
    const { rows } = await bancoRepository.findAll({ activo: true });
    return rows.map(b => ({ idBanco: b.idBanco, nombre: b.nombre }));
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener las opciones de promociones bancarias");
  }
};

module.exports = {
  getAllService,
  getByIdService,
  createService,
  updateService,
  deleteService,
  getOptionsService,
};
