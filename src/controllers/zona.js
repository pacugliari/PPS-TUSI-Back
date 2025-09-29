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

const createController = async (req, res) => {
  res.status(201).json(
    ResponseBuilder.success(
      await zonaService.createService(req),
      "Zona creada exitosamente"
    )
  );
};

const updateController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await zonaService.updateService(req),
      "Zona actualizada exitosamente"
    )
  );
};

module.exports = {
  getAllController,
  getByIdController,
  createController,
  updateController,
};
