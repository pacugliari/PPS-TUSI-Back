const ResponseBuilder = require("../utils/api-response");
const bancoService = require("../services/banco");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await bancoService.getAllService(req),
      "Bancos consultados exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await bancoService.getByIdService(req),
      "Banco consultado exitosamente"
    )
  );
};

const createController = async (req, res) => {
  res.status(201).json(
    ResponseBuilder.success(
      await bancoService.createService(req),
      "Banco creado exitosamente"
    )
  );
};

const updateController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await bancoService.updateService(req),
      "Banco actualizado exitosamente"
    )
  );
};

module.exports = {
  getAllController,
  getByIdController,
  createController,
  updateController,
};
