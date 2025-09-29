const HttpError = require("../utils/http-error");
const promocionBancariaRepository = require("../repositories/promocionbancaria");

const getAllService = async (req) => {
  try {
    const { rows } = await promocionBancariaRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener las promociones bancarias");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const promocion = await promocionBancariaRepository.findById(id);
  if (!promocion) throw new HttpError(404, "Promoción bancaria no encontrada");
  return { data: promocion };
};

const createService = async (req) => {
  const { idBanco, nombre, fechaDesde, fechaHasta, dias } = req.body;

  // Validaciones
  if (!idBanco || !nombre || !fechaDesde || !fechaHasta || !dias) {
    throw new HttpError(400, "Faltan campos requeridos").setErrors([
      ...(!idBanco ? [{ idBanco: "El banco es requerido" }] : []),
      ...(!nombre ? [{ nombre: "El nombre es requerido" }] : []),
      ...(!fechaDesde ? [{ fechaDesde: "La fecha desde es requerida" }] : []),
      ...(!fechaHasta ? [{ fechaHasta: "La fecha hasta es requerida" }] : []),
      ...(!dias ? [{ dias: "Los días son requeridos" }] : [])
    ]);
  }

  // Validar fechas
  if (new Date(fechaHasta) <= new Date(fechaDesde)) {
    throw new HttpError(400, "Fechas inválidas").setErrors([
      { fechas: "La fecha hasta debe ser posterior a la fecha desde" }
    ]);
  }

  // Validar días
  const diasValidos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  if (!Array.isArray(dias) || !dias.every(dia => diasValidos.includes(dia))) {
    throw new HttpError(400, "Días inválidos").setErrors([
      { dias: "Los días deben ser un array con valores válidos: lunes, martes, etc." }
    ]);
  }

  const promocion = await promocionBancariaRepository.create({
    idBanco,
    nombre,
    fechaDesde,
    fechaHasta,
    dias
  });
  return { data: promocion };
};

const updateService = async (req) => {
  const { id } = req.params;
  const { idBanco, nombre, fechaDesde, fechaHasta, dias } = req.body;

  const promocion = await promocionBancariaRepository.findById(id);
  if (!promocion) {
    throw new HttpError(404, "Promoción bancaria no encontrada");
  }

  // Validar que al menos un campo sea proporcionado
  if (!idBanco && !nombre && !fechaDesde && !fechaHasta && !dias) {
    throw new HttpError(400, "No hay campos para actualizar").setErrors([
      { body: "Debe proporcionar al menos un campo para actualizar" }
    ]);
  }

  // Validar fechas si se proporcionan
  if (fechaDesde || fechaHasta) {
    const nuevaFechaDesde = fechaDesde || promocion.fechaDesde;
    const nuevaFechaHasta = fechaHasta || promocion.fechaHasta;
    if (new Date(nuevaFechaHasta) <= new Date(nuevaFechaDesde)) {
      throw new HttpError(400, "Fechas inválidas").setErrors([
        { fechas: "La fecha hasta debe ser posterior a la fecha desde" }
      ]);
    }
  }

  // Validar días si se proporcionan
  if (dias) {
    const diasValidos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    if (!Array.isArray(dias) || !dias.every(dia => diasValidos.includes(dia))) {
      throw new HttpError(400, "Días inválidos").setErrors([
        { dias: "Los días deben ser un array con valores válidos: lunes, martes, etc." }
      ]);
    }
  }

  const promocionActualizada = await promocionBancariaRepository.update(id, {
    ...(idBanco && { idBanco }),
    ...(nombre && { nombre }),
    ...(fechaDesde && { fechaDesde }),
    ...(fechaHasta && { fechaHasta }),
    ...(dias && { dias })
  });

  return { data: promocionActualizada };
};

module.exports = {
  getAllService,
  getByIdService,
  createService,
  updateService,
};
