const HttpError = require("../utils/http-error");
const cuponRepository = require("../repositories/cupon");
const usuarioRepository = require("../repositories/usuario");
const { ROLES } = require("../constants/roles");

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
  const { idUsuario, porcentaje, codigo, fechaDesde, fechaHasta } = req.body;

  // Validaciones
  if (
    !idUsuario ||
    porcentaje === undefined ||
    porcentaje === null ||
    !codigo ||
    !fechaDesde ||
    !fechaHasta
  ) {
    throw new HttpError(400, "Faltan campos requeridos").setErrors([
      ...(!idUsuario ? [{ idUsuario: "El ID de usuario es requerido" }] : []),
      ...(!porcentaje ? [{ porcentaje: "El porcentaje es requerido" }] : []),
      ...(!codigo ? [{ codigo: "El código es requerido" }] : []),
      ...(!fechaDesde ? [{ fechaDesde: "La fecha desde es requerida" }] : []),
      ...(!fechaHasta ? [{ fechaHasta: "La fecha hasta es requerida" }] : []),
    ]);
  }

  // Validar que fechaHasta sea posterior a fechaDesde
  if (new Date(fechaHasta) < new Date(fechaDesde)) {
    throw new HttpError(400, "Fechas inválidas").setErrors([
      { fechas: "La fecha hasta debe ser posterior a la fecha desde" },
    ]);
  }

  // Verificar si ya existe un cupón con el mismo código
  const existingCupon = await cuponRepository.findOne({ codigo });
  if (existingCupon) {
    throw new HttpError(400, "Ya existe un cupón con ese código").setErrors([
      { codigo: "El código del cupón ya está en uso" },
    ]);
  }

  const cupon = await cuponRepository.create({
    idUsuario,
    porcentaje,
    codigo: codigo.toUpperCase(),
    fechaDesde,
    fechaHasta,
  });
  return { data: cupon };
};

const updateService = async (req) => {
  const { id } = req.params;
  const { porcentaje, codigo, fechaDesde, fechaHasta } = req.body;

  const cupon = await cuponRepository.findById(id);
  if (!cupon) throw new HttpError(404, "Cupón no encontrado");

  if (!porcentaje && !codigo && !fechaDesde && !fechaHasta) {
    throw new HttpError(400, "No hay campos para actualizar").setErrors([
      { body: "Debe proporcionar al menos un campo para actualizar" },
    ]);
  }

  // Si se actualiza el código, verificar que no exista otro cupón con ese código
  if (codigo && codigo !== cupon.codigo) {
    const existingCupon = await cuponRepository.findOne({ codigo });
    if (existingCupon) {
      throw new HttpError(400, "Ya existe un cupón con ese código").setErrors([
        { codigo: "El código del cupón ya está en uso" },
      ]);
    }
  }

  // Si se actualizan las fechas, validar que fechaHasta sea posterior a fechaDesde
  if (fechaDesde || fechaHasta) {
    const newFechaDesde = fechaDesde || cupon.fechaDesde;
    const newFechaHasta = fechaHasta || cupon.fechaHasta;
    if (new Date(newFechaHasta) < new Date(newFechaDesde)) {
      throw new HttpError(400, "Fechas inválidas").setErrors([
        { fechas: "La fecha hasta debe ser posterior a la fecha desde" },
      ]);
    }
  }

  const updatedCupon = await cuponRepository.update(id, {
    ...(porcentaje && { porcentaje }),
    ...(codigo && { codigo: codigo.toUpperCase() }),
    ...(fechaDesde && { fechaDesde }),
    ...(fechaHasta && { fechaHasta }),
  });

  return { data: updatedCupon };
};

const deleteService = async (req) => {
  const { id } = req.params;
  const cupon = await cuponRepository.findById(id);
  if (!cupon) throw new HttpError(404, "Cupón no encontrado");

  const updatedCupon = await cuponRepository.update(id, { activo: false });

  return { data: updatedCupon };
};

const getOptionsService = async () => {
  try {
    const { rows } = await usuarioRepository.findAll();

    return rows
      .filter((u) => u.rol.tipo === ROLES.USUARIO)
      .map((u) => ({
        idUsuario: u.idUsuario,
        nombre: u.perfil?.nombre || u.email || `Usuario ${u.idUsuario}`,
        email: u.email ?? null,
        dni: u.perfil?.dni ?? null,
        telefono: u.perfil?.telefono ?? null,
      }));
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener las opciones de cupones");
  }
};

const validateCodeService = async (req) => {
  const { code } = req.params;
  const idUsuario = req.user?.id;

  if (!code) {
    throw new HttpError(404, "Cupón no encontrado");
  }

  const codigo = String(code).toUpperCase();
  const cupon = await cuponRepository.findOne({ codigo });
  
  if (!cupon) {
    throw new HttpError(404, "Cupón no encontrado");
  }

  const now = new Date();
  const desde = new Date(cupon.fechaDesde);
  const hasta = new Date(cupon.fechaHasta);

  const enVigencia = now >= desde && now <= hasta;
  const perteneceAlUsuario =
    cupon.idUsuario ? String(cupon.idUsuario) === String(idUsuario) : true;

  if (!enVigencia || !perteneceAlUsuario) {
    throw new HttpError(400, "El cupón no es válido o ha expirado");
  }

  return { code: cupon.codigo, percent: cupon.porcentaje };
};

module.exports = {
  getAllService,
  getByIdService,
  createService,
  updateService,
  deleteService,
  getOptionsService,
  validateCodeService,
};
