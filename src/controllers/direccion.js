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

const getByUserController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await direccionService.getByUserService(req),
      "Direcciones del usuario consultadas exitosamente"
    )
  );
};

const createController = async (req, res) => {
  res.status(201).json(
    ResponseBuilder.success(
      await direccionService.createService(req),
      "Dirección creada exitosamente"
    )
  );
};

const updateController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await direccionService.updateService(req),
      "Dirección actualizada exitosamente"
    )
  );
};

const deleteController = async (req, res) => {
  await direccionService.deleteService(req);
  res.status(200).json(
    ResponseBuilder.success(null, "Dirección eliminada exitosamente", 204)
  );
};

module.exports = {
  getAllController,
  getByIdController,
  getByUserController,
  createController,
  updateController,
  deleteController,
};
