const ResponseBuilder = require("../utils/api-response");
const marcaService = require("../services/marca");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await marcaService.getAllService(req),
      "Marcas consultadas exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await marcaService.getByIdService(req),
      "Marca consultada exitosamente"
    )
  );
};

module.exports = {
  getAllController,
  getByIdController,
};
