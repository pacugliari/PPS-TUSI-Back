const HttpError = require("../utils/http-error");
const direccionRepository = require("../repositories/direccion");

const getAllService = async (req) => {
  try {
    const { rows } = await direccionRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener las direcciones");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const direccion = await direccionRepository.findById(id);
  if (!direccion) throw new HttpError(404, "Dirección no encontrada");
  return { data: direccion };
};

const createService = async (req) => {
  const { idZona, direccion, cp, alias, adicionales, principal } = req.body;
  const idUsuario = req.user.id;

  // Validaciones
  if (!idZona || !idUsuario || !direccion || !cp) {
    throw new HttpError(400, "Faltan campos requeridos").setErrors([
      ...(!idZona ? [{ idZona: "La zona es requerida" }] : []),
      ...(!idUsuario ? [{ idUsuario: "El ID de usuario es requerido" }] : []),
      ...(!direccion ? [{ direccion: "La dirección es requerida" }] : []),
      ...(!cp ? [{ cp: "El código postal es requerido" }] : [])
    ]);
  }

  const nuevaDireccion = await direccionRepository.create({
    idZona,
    idUsuario,
    direccion,
    cp,
    alias,
    adicionales,
    principal: principal ?? false
  });
  return { data: nuevaDireccion };
};

const updateService = async (req) => {
  const { id } = req.params;
  const { idZona, direccion, cp, alias, adicionales, principal } = req.body;

  const direccionExistente = await direccionRepository.findById(id);
  if (!direccionExistente) throw new HttpError(404, "Dirección no encontrada");

  // Validar que la dirección pertenezca al usuario autenticado
  const idUsuario = req.user.id;
  if (direccionExistente.idUsuario !== idUsuario) {
    throw new HttpError(403, "No tienes permiso para modificar esta dirección");
  }

  if (!idZona && !direccion && !cp && alias === undefined && adicionales === undefined && principal === undefined) {
    throw new HttpError(400, "No hay campos para actualizar").setErrors([
      { body: "Debe proporcionar al menos un campo para actualizar" }
    ]);
  }

  const direccionActualizada = await direccionRepository.update(id, {
    ...(idZona && { idZona }),
    ...(direccion && { direccion }),
    ...(cp && { cp }),
    ...(alias !== undefined && { alias }),
    ...(adicionales !== undefined && { adicionales }),
    ...(principal !== undefined && { principal })
  });

  return { data: direccionActualizada };
};

const deleteService = async (req) => {
  const { id } = req.params;
  const direccion = await direccionRepository.findById(id);
  if (!direccion) throw new HttpError(404, "Dirección no encontrada");
  await direccionRepository.remove(id);
  return true;
};

const getByUserService = async (req) => {
  const idUsuario = req.user.id;
  if (!idUsuario) throw new HttpError(401, "Usuario no autenticado");
  const direcciones = await direccionRepository.findByIdUser(idUsuario);
  return { data: direcciones };
};

const setPrimaryService = async (req) => {
  const { id } = req.params;
  const idUsuario = req.user.id;
  
  const direccion = await direccionRepository.findById(id);
  if (!direccion) throw new HttpError(404, "Dirección no encontrada");
  if (direccion.idUsuario !== idUsuario) {
    throw new HttpError(403, "No tienes permiso para modificar esta dirección");
  }
  
  const direccionesUsuario = await direccionRepository.findByIdUser(idUsuario);
  for (const dir of direccionesUsuario) {
    if (dir.principal) {
      await direccionRepository.update(dir.idDireccion, { principal: false });
    }
  }
  
  const actualizada = await direccionRepository.update(id, { principal: true });
  return { data: actualizada };
};

module.exports = {
  getAllService,
  getByIdService,
  getByUserService,
  createService,
  updateService,
  deleteService,
  setPrimaryService
};
