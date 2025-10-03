const HttpError = require("../utils/http-error");
const direccionRepository = require("../repositories/direccion");

const getAllService = async (req) => {
  try {
    const { rows } = await direccionRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener las direcciones");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const direccion = await direccionRepository.findById(id);
  if (!direccion) throw new HttpError(404, "Dirección no encontrada");
  return { data: direccion };
};

module.exports = {
  getAllService,
  getByIdService,
};
