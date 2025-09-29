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
  const { idZona, idUsuario, direccion, localidad, cp } = req.body;

  // Validaciones
  if (!idZona || !idUsuario || !direccion || !localidad || !cp) {
    throw new HttpError(400, "Faltan campos requeridos").setErrors([
      ...(!idZona ? [{ idZona: "La zona es requerida" }] : []),
      ...(!idUsuario ? [{ idUsuario: "El ID de usuario es requerido" }] : []),
      ...(!direccion ? [{ direccion: "La dirección es requerida" }] : []),
      ...(!localidad ? [{ localidad: "La localidad es requerida" }] : []),
      ...(!cp ? [{ cp: "El código postal es requerido" }] : [])
    ]);
  }

  const nuevaDireccion = await direccionRepository.create({
    idZona,
    idUsuario,
    direccion,
    localidad,
    cp
  });
  return { data: nuevaDireccion };
};

const updateService = async (req) => {
  const { id } = req.params;
  const { idZona, direccion, localidad, cp } = req.body;

  const direccionExistente = await direccionRepository.findById(id);
  if (!direccionExistente) throw new HttpError(404, "Dirección no encontrada");

  if (!idZona && !direccion && !localidad && !cp) {
    throw new HttpError(400, "No hay campos para actualizar").setErrors([
      { body: "Debe proporcionar al menos un campo para actualizar" }
    ]);
  }

  const direccionActualizada = await direccionRepository.update(id, {
    ...(idZona && { idZona }),
    ...(direccion && { direccion }),
    ...(localidad && { localidad }),
    ...(cp && { cp })
  });

  return { data: direccionActualizada };
};

module.exports = {
  getAllService,
  getByIdService,
  createService,
  updateService,
};
