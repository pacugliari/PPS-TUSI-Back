const HttpError = require("../utils/http-error");
const rolRepository = require("../repositories/rol");

const getAllService = async (req) => {
  try {
    const { rows } = await rolRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener los roles");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const rol = await rolRepository.findById(id);
  if (!rol) throw new HttpError(404, "Rol no encontrado");
  return { data: rol };
};

module.exports = {
  getAllService,
  getByIdService,
};
