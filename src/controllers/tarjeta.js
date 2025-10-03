const ResponseBuilder = require("../utils/api-response");
const tarjetaService = require("../services/tarjeta");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await tarjetaService.getAllService(req),
      "Tarjetas consultadas exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await tarjetaService.getByIdService(req),
      "Tarjeta consultada exitosamente"
    )
  );
};

module.exports = {
  getAllController,
  getByIdController,
};
