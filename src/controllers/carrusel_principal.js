// src/controllers/carrusel_principal.js
const ResponseBuilder = require("../utils/api-response");
const carruselPrincipalService = require("../services/carrusel_principal");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await carruselPrincipalService.getAllService(req),
      "Carrusel principal consultado exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await carruselPrincipalService.getByIdService(req),
      "Slide consultado exitosamente"
    )
  );
};

const createController = async (req, res) => {
  res.status(201).json(
    ResponseBuilder.success(
      await carruselPrincipalService.createService(req),
      "Slide creado exitosamente"
    )
  );
};

const updateController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await carruselPrincipalService.updateService(req),
      "Slide actualizado exitosamente"
    )
  );
};

const deleteController = async (req, res) => {
  await carruselPrincipalService.deleteService(req);
  res.status(200).json(
    ResponseBuilder.success(null, "Slide eliminado exitosamente", 204)
  );
};

module.exports = {
  getAllController,
  getByIdController,
  createController,
  updateController,
  deleteController,
};
