const HttpError = require("../utils/http-error");
const categoriaRepository = require("../repositories/categoria");

const getAllService = async (req) => {
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
  if (!categoria) throw new HttpError(404, "Categoría no encontrada");
  return { data: categoria };
};

const createService = async (req) => {
  const { nombre, descripcion } = req.body;
  if (!nombre) {
    throw new HttpError(400, "El nombre es requerido");
  }
  const categoria = await categoriaRepository.create({
    nombre,
    descripcion
  });
  return categoria;
};

const updateService = async (req) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  if (!nombre) {
    throw new HttpError(400, "El nombre es requerido para actualizar");
  }
  const categoriaExistente = await categoriaRepository.findById(id);
  if (!categoriaExistente) throw new HttpError(404, "Categoría no encontrada");
  const categoria = await categoriaRepository.update(id, {
    nombre,
    descripcion
  });
  return categoria;
};

const deleteService = async (req) => {
  const { id } = req.params;
  const categoria = await categoriaRepository.findById(id);
  if (!categoria) throw new HttpError(404, "Categoría no encontrada");
  await categoriaRepository.remove(id);
  return true;
};

module.exports = {
  getAllService,
  getByIdService,
  createService,
  updateService,
  deleteService,
};
