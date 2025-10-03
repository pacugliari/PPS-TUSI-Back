const ResponseBuilder = require("../utils/api-response");
const categoriaService = require("../services/categoria");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await categoriaService.getAllService(req),
      "Categorias consultadas exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await categoriaService.getByIdService(req),
      "Categoria consultada exitosamente"
    )
  );
};

module.exports = {
  getAllController,
  getByIdController,
};
