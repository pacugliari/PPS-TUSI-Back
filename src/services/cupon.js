const HttpError = require("../utils/http-error");
const cuponRepository = require("../repositories/cupon");

const getAllService = async (req) => {
  try {
    const { rows } = await cuponRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener los cupones");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const cupon = await cuponRepository.findById(id);
  if (!cupon) throw new HttpError(404, "Cupón no encontrado");
  return { data: cupon };
};

module.exports = {
  getAllService,
  getByIdService,
};
