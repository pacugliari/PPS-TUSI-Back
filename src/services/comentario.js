const HttpError = require("../utils/http-error");
const comentarioRepository = require("../repositories/comentario");

const getAllService = async (req) => {
  try {
    const { rows } = await comentarioRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener los comentarios");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const comentario = await comentarioRepository.findById(id);
  if (!comentario) throw new HttpError(404, "Comentario no encontrado");
  return { data: comentario };
};

module.exports = {
  getAllService,
  getByIdService,
};
