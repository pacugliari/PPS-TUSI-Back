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

const createController = async (req, res) => {
  res.status(201).json(
    ResponseBuilder.success(
      await tarjetaService.createService(req),
      "Tarjeta creada exitosamente"
    )
  );
};

const updateController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await tarjetaService.updateService(req),
      "Tarjeta actualizada exitosamente"
    )
  );
};

const deleteController = async (req, res) => {
  await tarjetaService.deleteService(req);
  res.status(200).json(
    ResponseBuilder.success(null, "Tarjeta eliminada exitosamente", 204)
  );
};

module.exports = {
  getAllController,
  getByIdController,
  createController,
  updateController,
  deleteController
};
