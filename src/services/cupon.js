const HttpError = require("../utils/http-error");
const cuponRepository = require("../repositories/cupon");

const getAllService = async (req) => {
  try {
    const { rows } = await cuponRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener los cupones");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const cupon = await cuponRepository.findById(id);
  if (!cupon) throw new HttpError(404, "Cupón no encontrado");
  return { data: cupon };
};

const createService = async (req) => {
  const { idUsuario, monto, codigo, fechaDesde, fechaHasta } = req.body;

  // Validaciones
  if (!idUsuario || !monto || !codigo || !fechaDesde || !fechaHasta) {
    throw new HttpError(400, "Faltan campos requeridos").setErrors([
      ...(!idUsuario ? [{ idUsuario: "El ID de usuario es requerido" }] : []),
      ...(!monto ? [{ monto: "El monto es requerido" }] : []),
      ...(!codigo ? [{ codigo: "El código es requerido" }] : []),
      ...(!fechaDesde ? [{ fechaDesde: "La fecha desde es requerida" }] : []),
      ...(!fechaHasta ? [{ fechaHasta: "La fecha hasta es requerida" }] : [])
    ]);
  }

  // Validar que fechaHasta sea posterior a fechaDesde
  if (new Date(fechaHasta) <= new Date(fechaDesde)) {
    throw new HttpError(400, "Fechas inválidas").setErrors([
      { fechas: "La fecha hasta debe ser posterior a la fecha desde" }
    ]);
  }

  // Verificar si ya existe un cupón con el mismo código
  const existingCupon = await cuponRepository.findOne({ codigo });
  if (existingCupon) {
    throw new HttpError(400, "Ya existe un cupón con ese código").setErrors([
      { codigo: "El código del cupón ya está en uso" }
    ]);
  }

  const cupon = await cuponRepository.create({
    idUsuario,
    monto,
    codigo,
    fechaDesde,
    fechaHasta
  });
  return { data: cupon };
};

const updateService = async (req) => {
  const { id } = req.params;
  const { monto, codigo, fechaDesde, fechaHasta } = req.body;

  const cupon = await cuponRepository.findById(id);
  if (!cupon) throw new HttpError(404, "Cupón no encontrado");

  if (!monto && !codigo && !fechaDesde && !fechaHasta) {
    throw new HttpError(400, "No hay campos para actualizar").setErrors([
      { body: "Debe proporcionar al menos un campo para actualizar" }
    ]);
  }

  // Si se actualiza el código, verificar que no exista otro cupón con ese código
  if (codigo && codigo !== cupon.codigo) {
    const existingCupon = await cuponRepository.findOne({ codigo });
    if (existingCupon) {
      throw new HttpError(400, "Ya existe un cupón con ese código").setErrors([
        { codigo: "El código del cupón ya está en uso" }
      ]);
    }
  }

  // Si se actualizan las fechas, validar que fechaHasta sea posterior a fechaDesde
  if (fechaDesde || fechaHasta) {
    const newFechaDesde = fechaDesde || cupon.fechaDesde;
    const newFechaHasta = fechaHasta || cupon.fechaHasta;
    if (new Date(newFechaHasta) <= new Date(newFechaDesde)) {
      throw new HttpError(400, "Fechas inválidas").setErrors([
        { fechas: "La fecha hasta debe ser posterior a la fecha desde" }
      ]);
    }
  }

  const updatedCupon = await cuponRepository.update(id, {
    ...(monto && { monto }),
    ...(codigo && { codigo }),
    ...(fechaDesde && { fechaDesde }),
    ...(fechaHasta && { fechaHasta })
  });

  return { data: updatedCupon };
};

const deleteService = async (req) => {
  const { id } = req.params;
  const cupon = await cuponRepository.findById(id);
  if (!cupon) throw new HttpError(404, "Cupón no encontrado");
  await cuponRepository.remove(id);
  return true;
};

module.exports = {
  getAllService,
  getByIdService,
  createService,
  updateService,
  deleteService,
};
