const HttpError = require("../utils/http-error");
const zonaRepository = require("../repositories/zona");

const getAllService = async (req) => {
  try {
    const { rows } = await zonaRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener las zonas");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const zona = await zonaRepository.findById(id);
  if (!zona) throw new HttpError(404, "Zona no encontrada");
  return { data: zona };
};

module.exports = {
  getAllService,
  getByIdService,
};
