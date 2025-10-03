const HttpError = require("../utils/http-error");
const tarjetaRepository = require("../repositories/tarjeta");

const getAllService = async (req) => {
  try {
    const { rows } = await tarjetaRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener las tarjetas");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const tarjeta = await tarjetaRepository.findById(id);
  if (!tarjeta) throw new HttpError(404, "Tarjeta no encontrada");
  return { data: tarjeta };
};

module.exports = {
  getAllService,
  getByIdService,
};
