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

module.exports = {
  getAllService,
  getByIdService,
};
