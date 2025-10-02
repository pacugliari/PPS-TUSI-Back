const ResponseBuilder = require("../utils/api-response");
const direccionService = require("../services/direccion");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await direccionService.getAllService(req),
      "Direcciones consultadas exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await direccionService.getByIdService(req),
      "Dirección consultada exitosamente"
    )
  );
};

module.exports = {
  getAllController,
  getByIdController,
};
