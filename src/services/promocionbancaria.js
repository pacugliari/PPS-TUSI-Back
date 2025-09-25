const HttpError = require("../utils/http-error");
const promocionBancariaRepository = require("../repositories/promocionbancaria");

const getAllService = async (req) => {
  try {
    const { rows } = await promocionBancariaRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener las promociones bancarias");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const promocion = await promocionBancariaRepository.findById(id);
  if (!promocion) throw new HttpError(404, "Promoción bancaria no encontrada");
  return { data: promocion };
};

module.exports = {
  getAllService,
  getByIdService,
};
