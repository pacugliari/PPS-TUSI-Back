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

module.exports = {
  getAllService,
  getByIdService,
};
