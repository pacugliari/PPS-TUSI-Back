const HttpError = require("../utils/http-error");
const comentarioRepository = require("../repositories/comentario");
const comentario = require("../models/comentario");

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

const createService = async (req) => {
  const { puntuacion, comentario: texto } = req.body;
  const idUsuario = req.user?.id;
  const { idProducto } = req.params;

  if (!idUsuario || !idProducto || !texto) {
    throw new HttpError(400, "Usuario, producto y comentario son requeridos");
  }
  if (puntuacion == null || puntuacion < 1 || puntuacion > 5) {
    throw new HttpError(400, "La puntuación debe ser entre 1 y 5");
  }

  const yaExiste = await comentarioRepository.findOne({
    idUsuario: Number(idUsuario),
    idProducto: Number(idProducto),
  });
  if (yaExiste) {
    throw new HttpError(
      400,
      "El usuario ya realizó una valoración de este producto"
    );
  }

  const nuevoComentario = await comentarioRepository.create({
    idUsuario: Number(idUsuario),
    idProducto: Number(idProducto),
    puntuacion: Number(puntuacion),
    comentario: String(texto).trim(),
  });

  return nuevoComentario;
};

const updateService = async (req) => {
  const { id } = req.params;
  const { puntuacion, comentario: texto } = req.body;

  // Verificar si existe
  const comentarioExistente = await comentarioRepository.findById(id);
  if (!comentarioExistente)
    throw new HttpError(404, "Comentario no encontrado");

  // Validaciones
  if (!texto) {
    throw new HttpError(400, "El comentario es requerido");
  }

  if (puntuacion && (puntuacion < 1 || puntuacion > 5)) {
    throw new HttpError(400, "La puntuación debe ser entre 1 y 5");
  }

  const comentario = await comentarioRepository.update(id, {
    puntuacion,
    comentario: texto,
  });

  return comentario;
};

const deleteService = async (req) => {
  const { id } = req.params;
  const comentario = await comentarioRepository.findById(id);
  if (!comentario) throw new HttpError(404, "Comentario no encontrado");
  await comentarioRepository.remove(id);
  return true;
};

module.exports = {
  getAllService,
  getByIdService,
  createService,
  updateService,
  deleteService,
};
