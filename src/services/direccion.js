const HttpError = require("../utils/http-error");
const direccionRepository = require("../repositories/direccion");
const zonaRepository = require("../repositories/zona");

const getAllService = async (req) => {
  try {
    const { rows } = await direccionRepository.findAll();
    return rows.filter(d => d.activo);
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener las direcciones");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const direccion = await direccionRepository.findById(id);
  if (!direccion || !direccion.activo) throw new HttpError(404, "Dirección no encontrada");
  return { data: direccion };
};

const createService = async (req) => {
  const { idZona, direccion, cp, localidad, alias, adicionales, principal } = req.body;
  const idUsuario = req.user.id;

  if (!idZona || !idUsuario || !direccion || !cp || !localidad) {
    throw new HttpError(400, "Faltan campos requeridos").setErrors([
      ...(!idZona ? [{ idZona: "La zona es requerida" }] : []),
      ...(!idUsuario ? [{ idUsuario: "El ID de usuario es requerido" }] : []),
      ...(!direccion ? [{ direccion: "La dirección es requerida" }] : []),
      ...(!cp ? [{ cp: "El código postal es requerido" }] : []),
      ...(!localidad ? [{ localidad: "La localidad es requerida" }] : [])
    ]);
  }

  const nuevaDireccion = await direccionRepository.create({
    idZona,
    idUsuario,
    direccion,
    cp,
    localidad,
    alias,
    adicionales,
    principal: principal ?? false,
    activo: true
  });
  return { data: nuevaDireccion };
};

const updateService = async (req) => {
  const { id } = req.params;
  const { idZona, direccion, cp, localidad, alias, adicionales, principal, activo } = req.body;

  const direccionExistente = await direccionRepository.findById(id);
  if (!direccionExistente || !direccionExistente.activo) throw new HttpError(404, "Dirección no encontrada");

  const idUsuario = req.user.id;
  if (direccionExistente.idUsuario !== idUsuario) {
    throw new HttpError(403, "No tienes permiso para modificar esta dirección");
  }

  if (
    !idZona &&
    !direccion &&
    !cp &&
    !localidad &&
    alias === undefined &&
    adicionales === undefined &&
    principal === undefined &&
    activo === undefined
  ) {
    throw new HttpError(400, "No hay campos para actualizar").setErrors([
      { body: "Debe proporcionar al menos un campo para actualizar" }
    ]);
  }

  const direccionActualizada = await direccionRepository.update(id, {
    ...(idZona && { idZona }),
    ...(direccion && { direccion }),
    ...(cp && { cp }),
    ...(localidad && { localidad }),
    ...(alias !== undefined && { alias }),
    ...(adicionales !== undefined && { adicionales }),
    ...(principal !== undefined && { principal }),
    ...(activo !== undefined && { activo })
  });

  return { data: direccionActualizada };
};

const deleteService = async (req) => {
  const { id } = req.params;
  const direccion = await direccionRepository.findById(id);
  if (!direccion || !direccion.activo) throw new HttpError(404, "Dirección no encontrada");
  await direccionRepository.update(id, { activo: false });
  return true;
};

const getByUserService = async (req) => {
  const idUsuario = req.user.id;
  if (!idUsuario) throw new HttpError(401, "Usuario no autenticado");
  const direcciones = await direccionRepository.findByIdUser(idUsuario);
  return { data: direcciones.filter(d => d.activo) };
};

const setPrimaryService = async (req) => {
  const { id } = req.params;
  const idUsuario = req.user.id;

  const direccion = await direccionRepository.findById(id);
  if (!direccion || !direccion.activo) throw new HttpError(404, "Dirección no encontrada");
  if (direccion.idUsuario !== idUsuario) {
    throw new HttpError(403, "No tienes permiso para modificar esta dirección");
  }

  const direccionesUsuario = await direccionRepository.findByIdUser(idUsuario);
  for (const dir of direccionesUsuario) {
    if (dir.principal && dir.activo) {
      await direccionRepository.update(dir.idDireccion, { principal: false });
    }
  }

  const actualizada = await direccionRepository.update(id, { principal: true });
  return { data: actualizada };
};

// Servicio auxiliar para Checkout: direcciones activas del usuario
const getCheckoutAddressesService = async (req) => {
  const idUsuario = req.user?.id;
  if (!idUsuario) throw new HttpError(401, "Usuario no autenticado");
  const direcciones = await direccionRepository.findByIdUser(idUsuario);
  const activas = direcciones.filter((d) => d.activo);
  // Enriquecer zona con todos los campos requeridos para el payload
  const enriched = await Promise.all(
    activas.map(async (d) => {
      const zonaId = d.idZona || d.zona?.idZona;
      let zona = d.zona || null;
      if (zonaId) {
        const fullZona = await zonaRepository.findById(zonaId);
        if (fullZona) {
          zona = {
            idZona: fullZona.idZona,
            nombre: fullZona.nombre,
            ciudad: fullZona.ciudad,
            provincia: fullZona.provincia,
            costoEnvio: fullZona.costoEnvio,
          };
        }
      }
      const { activo, ...rest } = d;
      return { ...rest, zona };
    })
  );
  return enriched;
};

module.exports = {
  getAllService,
  getByIdService,
  getByUserService,
  getCheckoutAddressesService,
  createService,
  updateService,
  deleteService,
  setPrimaryService
};