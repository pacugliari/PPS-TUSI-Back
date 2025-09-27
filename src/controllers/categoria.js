const ResponseBuilder = require("../utils/api-response");
const categoriaService = require("../services/categoria");

const getAllController = async (req, res) => {
  try {
    const result = await categoriaService.getAllService(req);
    res.status(200).json(
      ResponseBuilder.success(
        result,
        "Categorias consultadas exitosamente"
      )
    );
  } catch (err) {
    next(err);
  }
};

const getByIdController = async (req, res) => {
  try {
    const result = await categoriaService.getByIdService(req);
    res.status(200).json(
      ResponseBuilder.success(
        result,
        "Categoria consultada exitosamente"
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
