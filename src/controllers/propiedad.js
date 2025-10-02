const ResponseBuilder = require("../utils/api-response");
const propiedadService = require("../services/propiedad");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await propiedadService.getAllService(req),
      "Propiedades consultadas exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await propiedadService.getByIdService(req),
      "Propiedad consultada exitosamente"
    )
  );
};

module.exports = {
  getAllController,
  getByIdController,
};
