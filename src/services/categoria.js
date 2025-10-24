const HttpError = require("../utils/http-error");
const categoriaRepository = require("../repositories/categoria");

const getAllService = async () => {
  try {
    const { rows } = await categoriaRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener las categorías");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const categoria = await categoriaRepository.findById(id);

  if (!categoria || categoria.activo === false) {
    throw new HttpError(404, "Categoría no encontrada");
  }
  return { data: categoria };
};

const createService = async (req) => {
  const { nombre, descripcion } = req.body;

  if (!nombre) {
    throw new HttpError(400, "El nombre es requerido").setErrors([
      { nombre: "El nombre de la categoría es requerido" },
    ]);
  }

  const categoriaExistente = await categoriaRepository.findOne({ nombre });
  if (categoriaExistente) {
    throw new HttpError(400, "Ya existe una categoría con ese nombre").setErrors([
      { nombre: "El nombre de la categoría ya está registrado" },
    ]);
  }

  const categoria = await categoriaRepository.create({
    nombre,
    descripcion,
    activo: true,
  });
  return { data: categoria };
};

const updateService = async (req) => {
  const { id } = req.params;
  const { nombre, descripcion, activo } = req.body;

  const categoria = await categoriaRepository.findById(id);
  if (!categoria || categoria.activo === false) {
    throw new HttpError(404, "Categoría no encontrada");
  }

  if (!nombre && descripcion === undefined && activo === undefined) {
    throw new HttpError(400, "No hay campos para actualizar").setErrors([
      { body: "Debe proporcionar al menos un campo para actualizar" },
    ]);
  }

  if (nombre && nombre !== categoria.nombre) {
    const categoriaExistente = await categoriaRepository.findOne({ nombre });
    if (categoriaExistente) {
      throw new HttpError(400, "Ya existe una categoría con ese nombre").setErrors([
        { nombre: "El nombre de la categoría ya está registrado" },
      ]);
    }
  }

  const categoriaActualizada = await categoriaRepository.update(id, {
    ...(nombre && { nombre }),
    ...(descripcion !== undefined && { descripcion }),
    ...(activo !== undefined && { activo }),
  });

  return { data: categoriaActualizada };
};

const deleteService = async (req) => {
  const { id } = req.params;
  const categoria = await categoriaRepository.findById(id);
  if (!categoria || categoria.activo === false) {
    throw new HttpError(404, "Categoría no encontrada");
  }

  const categoriaActualizada = await categoriaRepository.update(id, { activo: false });
  return { data: categoriaActualizada };
};

module.exports = {
  getAllService,
  getByIdService,
  createService,
  updateService,
  deleteService,
};
