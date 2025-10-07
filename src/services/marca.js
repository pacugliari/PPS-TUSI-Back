const HttpError = require("../utils/http-error");
const marcaRepository = require("../repositories/marca");

const getAllService = async (req) => {
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
  if (!marca) throw new HttpError(404, "Marca no encontrada");
  return { data: marca };
};

const createService = async (req) => {
  const { nombre, descripcion } = req.body;

  if (!nombre) {
    throw new HttpError(400, "El nombre es requerido");
  }

  // Verificar si ya existe una marca con el mismo nombre
  const marcaExistente = await marcaRepository.findOne({ nombre });
  if (marcaExistente) {
    throw new HttpError(400, "Ya existe una marca con ese nombre");
  }

  const marca = await marcaRepository.create({ nombre, descripcion });
  return marca;
};

const updateService = async (req) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  if (!nombre) {
    throw new HttpError(400, "El nombre es requerido para actualizar");
  }

  // Verificar si existe la marca
  const marca = await marcaRepository.findById(id);
  if (!marca) {
    throw new HttpError(404, "Marca no encontrada");
  }

  // Verificar si ya existe otra marca con el mismo nombre
  if (nombre !== marca.nombre) {
    const marcaExistente = await marcaRepository.findOne({ nombre });
    if (marcaExistente) {
      throw new HttpError(400, "Ya existe una marca con ese nombre");
    }
  }

  const marcaActualizada = await marcaRepository.update(id, { nombre, descripcion });
  return marcaActualizada;
};

const deleteService = async (req) => {
  const { id } = req.params;
  const marca = await marcaRepository.findById(id);
  if (!marca) throw new HttpError(404, "Marca no encontrada");
  await marcaRepository.remove(id);
  return true;
};

module.exports = {
  getAllService,
  getByIdService,
  createService,
  updateService,
  deleteService,
};
