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

const createController = async (req, res) => {
  res.status(201).json(
    ResponseBuilder.success(
      await caracteristicaService.createService(req),
      "Característica creada exitosamente"
    )
  );
};

const updateController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await caracteristicaService.updateService(req),
      "Característica actualizada exitosamente"
    )
  );
};

const deleteController = async (req, res) => {
  await caracteristicaService.deleteService(req);
  res.status(200).json(
    ResponseBuilder.success(null, "Característica eliminada exitosamente")
  );
};

module.exports = {
  getAllController,
  getByIdController,
  createController,
  updateController,
  deleteController,
};
