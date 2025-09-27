const ResponseBuilder = require("../utils/api-response");
const subcategoriaService = require("../services/subcategoria");

const getAllController = async (req, res) => {
  try {
    const subcategorias = await subcategoriaService.getAllService(req);
    res.status(200).json(
      ResponseBuilder.success(
        subcategorias,
        "Subcategorías consultadas exitosamente"
      )
    );
  } catch (err) {
    next(err);
  }
};

const getByIdController = async (req, res) => {
  try {
    const result = await subcategoriaService.getByIdService(req);
    res.status(200).json(
      ResponseBuilder.success(
        result,
        "Subcategoría consultada exitosamente"
      )
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllController,
  getByIdController,
};
