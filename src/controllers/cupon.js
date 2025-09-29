const ResponseBuilder = require("../utils/api-response");
const cuponService = require("../services/cupon");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await cuponService.getAllService(req),
      "Cupones consultados exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await cuponService.getByIdService(req),
      "Cupón consultado exitosamente"
    )
  );
};

const createController = async (req, res) => {
  res.status(201).json(
    ResponseBuilder.success(
      await cuponService.createService(req),
      "Cupón creado exitosamente"
    )
  );
};

const updateController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await cuponService.updateService(req),
      "Cupón actualizado exitosamente"
    )
  );
};

module.exports = {
  getAllController,
  getByIdController,
  createController,
  updateController,
};
