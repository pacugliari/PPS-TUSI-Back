const ResponseBuilder = require("../utils/api-response");
const subcategoriaService = require("../services/subcategoria");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await subcategoriaService.getAllService(req),
      "Subcategorías consultadas exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await subcategoriaService.getByIdService(req),
      "Subcategoría consultada exitosamente"
    )
  );
};

module.exports = {
  getAllController,
  getByIdController,
};
