const HttpError = require("../utils/http-error");
const perfilRepository = require("../repositories/perfil");

const getAllService = async (req) => {
  try {
    const { rows } = await perfilRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener los perfiles");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const perfil = await perfilRepository.findById(id);
  if (!perfil) throw new HttpError(404, "Perfil no encontrado");
  return { data: perfil };
};

const createService = async (req) => {
  const { idUsuario, nombre, dni, telefono } = req.body;

  // Validaciones
  if (!idUsuario || !nombre || !dni) {
    throw new HttpError(400, "Faltan campos requeridos").setErrors([
      ...(!idUsuario ? [{ idUsuario: "El ID de usuario es requerido" }] : []),
      ...(!nombre ? [{ nombre: "El nombre es requerido" }] : []),
      ...(!dni ? [{ dni: "El DNI es requerido" }] : [])
    ]);
  }

  // Verificar si ya existe un perfil para este usuario
  const existingPerfil = await perfilRepository.findOne({ idUsuario });
  if (existingPerfil) {
    throw new HttpError(400, "Ya existe un perfil para este usuario").setErrors([
      { idUsuario: "El usuario ya tiene un perfil asociado" }
    ]);
  }

  const perfil = await perfilRepository.create({ idUsuario, nombre, dni, telefono });
  return { data: perfil };
};

const updateService = async (req) => {
  const { id } = req.params;
  const { nombre, dni, telefono } = req.body;

  const perfil = await perfilRepository.findById(id);
  if (!perfil) throw new HttpError(404, "Perfil no encontrado");

  if (!nombre && !dni && !telefono) {
    throw new HttpError(400, "No hay campos para actualizar").setErrors([
      { body: "Debe proporcionar al menos un campo para actualizar" }
    ]);
  }

  const updatedPerfil = await perfilRepository.update(id, {
    ...(nombre && { nombre }),
    ...(dni && { dni }),
    ...(telefono && { telefono })
  });

  return { data: updatedPerfil };
};

module.exports = {
  getAllService,
  getByIdService,
  createService,
  updateService,
};
