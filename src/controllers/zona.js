const ResponseBuilder = require("../utils/api-response");
const zonaService = require("../services/zona");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await zonaService.getAllService(req),
      "Zonas consultadas exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await zonaService.getByIdService(req),
      "Zona consultada exitosamente"
    )
  );
};

module.exports = {
  getAllController,
  getByIdController,
};
