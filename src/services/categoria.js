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

module.exports = {
  getAllService,
  getByIdService,
};
