const HttpError = require("../utils/http-error");
const stockRepository = require("../repositories/stock");

const getAllService = async (req) => {
  try {
    const { rows } = await stockRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudo obtener el stock");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const stock = await stockRepository.findById(id);
  if (!stock) throw new HttpError(404, "Stock no encontrado");
  return { data: stock };
};

module.exports = {
  getAllService,
  getByIdService,
};
