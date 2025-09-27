const HttpError = require("../utils/http-error");
const subcategoriaRepository = require("../repositories/subcategoria");

const getAllService = async (req) => {
  try {
    const { rows } = await subcategoriaRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener las subcategorías");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const subcategoria = await subcategoriaRepository.findById(id);
  if (!subcategoria) throw new HttpError(404, "Subcategoría no encontrada");
  return { data: subcategoria };
};

module.exports = {
  getAllService,
  getByIdService,
};
