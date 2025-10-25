const HttpError = require("../utils/http-error");
const marcaRepository = require("../repositories/marca");

const getAllService = async () => {
  try {
    const { rows } = await marcaRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener las marcas");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const marca = await marcaRepository.findById(id);

  if (!marca || marca.activo === false) {
    throw new HttpError(404, "Marca no encontrada");
  }
  return { data: marca };
};

const createService = async (req) => {
  const { nombre, descripcion } = req.body;

  if (!nombre) {
    throw new HttpError(400, "El nombre es requerido").setErrors([
      { nombre: "El nombre de la marca es requerido" },
    ]);
  }

  const marcaExistente = await marcaRepository.findOne({ nombre });
  if (marcaExistente) {
    throw new HttpError(400, "Ya existe una marca con ese nombre").setErrors([
      { nombre: "El nombre de la marca ya está registrado" },
    ]);
  }

  const marca = await marcaRepository.create({
    nombre,
    descripcion,
    activo: true,
  });
  return { data: marca };
};

const updateService = async (req) => {
  const { id } = req.params;
  const { nombre, descripcion, activo } = req.body;

  const marca = await marcaRepository.findById(id);
  if (!marca || marca.activo === false) {
    throw new HttpError(404, "Marca no encontrada");
  }

  if (!nombre && descripcion === undefined && activo === undefined) {
    throw new HttpError(400, "No hay campos para actualizar").setErrors([
      { body: "Debe proporcionar al menos un campo para actualizar" },
    ]);
  }

  if (nombre && nombre !== marca.nombre) {
    const marcaExistente = await marcaRepository.findOne({ nombre });
    if (marcaExistente) {
      throw new HttpError(400, "Ya existe una marca con ese nombre").setErrors([
        { nombre: "El nombre de la marca ya está registrado" },
      ]);
    }
  }

  const marcaActualizada = await marcaRepository.update(id, {
    ...(nombre && { nombre }),
    ...(descripcion !== undefined && { descripcion }),
    ...(activo !== undefined && { activo }),
  });

  return { data: marcaActualizada };
};

const deleteService = async (req) => {
  const { id } = req.params;
  const marca = await marcaRepository.findById(id);
  if (!marca || marca.activo === false) {
    throw new HttpError(404, "Marca no encontrada");
  }

  const marcaActualizada = await marcaRepository.update(id, { activo: false });
  return { data: marcaActualizada };
};

module.exports = {
  getAllService,
  getByIdService,
  createService,
  updateService,
  deleteService,
};
