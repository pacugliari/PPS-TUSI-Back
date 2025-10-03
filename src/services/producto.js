const HttpError = require("../utils/http-error");
const productRepository = require("../repositories/producto");

const getAllService = async (req) => {
  try {
    const { rows } = await productRepository.findAll();

    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener los productos");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const product = await productRepository.findById(id);
  if (!product) throw new HttpError(404, "Producto no encontrado");
  return { data: product };
};

module.exports = {
  getAllService,
  getByIdService,
};
