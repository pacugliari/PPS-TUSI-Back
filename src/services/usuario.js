const HttpError = require("../utils/http-error");
const usuarioRepository = require("../repositories/usuario");

const getAllService = async (req) => {
  try {
    const { rows } = await usuarioRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener los usuarios");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const usuario = await usuarioRepository.findById(id);
  if (!usuario) throw new HttpError(404, "Usuario no encontrado");
  return { data: usuario };
};

module.exports = {
  getAllService,
  getByIdService,
};
