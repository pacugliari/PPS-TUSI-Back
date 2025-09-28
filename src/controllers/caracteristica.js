const ResponseBuilder = require("../utils/api-response");
const caracteristicaService = require("../services/caracteristica");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await caracteristicaService.getAllService(req),
      "Caracteristicas consultadas exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await caracteristicaService.getByIdService(req),
      "Caracteristica consultada exitosamente"
    )
  );
};

module.exports = {
  getAllController,
  getByIdController,
};
