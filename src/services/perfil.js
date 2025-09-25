const HttpError = require("../utils/http-error");
const perfilRepository = require("../repositories/perfil");

const getAllService = async (req) => {
  try {
    const { rows } = await perfilRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener los perfiles");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const perfil = await perfilRepository.findById(id);
  if (!perfil) throw new HttpError(404, "Perfil no encontrado");
  return { data: perfil };
};

module.exports = {
  getAllService,
  getByIdService,
};
