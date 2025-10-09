const HttpError = require("../utils/http-error");
const caracteristicaRepository = require("../repositories/caracteristica");

const getAllService = async (req) => {
  try {
    const { rows } = await caracteristicaRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener las características");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const caracteristica = await caracteristicaRepository.findById(id);
  if (!caracteristica) throw new HttpError(404, "Característica no encontrada");
  return { data: caracteristica };
};

const createService = async (req) => {
  const { descripcion } = req.body;
  if (!descripcion) {
    throw new HttpError(400, "La descripción es requerida");
  }
  const caracteristica = await caracteristicaRepository.create({ descripcion });
  return caracteristica;
};

const updateService = async (req) => {
  const { id } = req.params;
  const { descripcion } = req.body;
  if (!descripcion) {
    throw new HttpError(400, "La descripción es requerida para actualizar");
  }
  const caracteristicaExistente = await caracteristicaRepository.findById(id);
  if (!caracteristicaExistente) throw new HttpError(404, "Característica no encontrada");
  const caracteristica = await caracteristicaRepository.update(id, { descripcion });
  return caracteristica;
};

const deleteService = async (req) => {
  const { id } = req.params;
  const caracteristica = await caracteristicaRepository.findById(id);
  if (!caracteristica) throw new HttpError(404, "Característica no encontrada");
  await caracteristicaRepository.remove(id);
  return true;
};

module.exports = {
  getAllService,
  getByIdService,
  createService,
  updateService,
  deleteService,
};
