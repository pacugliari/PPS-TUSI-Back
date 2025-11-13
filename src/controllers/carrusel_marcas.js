// src/controllers/carrusel_marcas.js
const ResponseBuilder = require("../utils/api-response");
const carruselMarcasService = require("../services/carrusel_marcas");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await carruselMarcasService.getAllService(req),
      "Carrusel de marcas consultado exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await carruselMarcasService.getByIdService(req),
      "Marca del carrusel consultada exitosamente"
    )
  );
};

const createController = async (req, res) => {
  res.status(201).json(
    ResponseBuilder.success(
      await carruselMarcasService.createService(req),
      "Marca añadida al carrusel exitosamente"
    )
  );
};

const updateController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await carruselMarcasService.updateService(req),
      "Marca del carrusel actualizada exitosamente"
    )
  );
};

const deleteController = async (req, res) => {
  await carruselMarcasService.deleteService(req);
  res.status(200).json(
    ResponseBuilder.success(null, "Marca eliminada del carrusel", 204)
  );
};

module.exports = {
  getAllController,
  getByIdController,
  createController,
  updateController,
  deleteController,
};
