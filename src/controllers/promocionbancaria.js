const ResponseBuilder = require("../utils/api-response");
const promocionBancariaService = require("../services/promocionbancaria");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await promocionBancariaService.getAllService(req),
      "Promociones bancarias consultadas exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await promocionBancariaService.getByIdService(req),
      "Promoción bancaria consultada exitosamente"
    )
  );
};

const createController = async (req, res) => {
  res.status(201).json(
    ResponseBuilder.success(
      await promocionBancariaService.createService(req),
      "Promoción bancaria creada exitosamente"
    )
  );
};

const updateController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await promocionBancariaService.updateService(req),
      "Promoción bancaria actualizada exitosamente"
    )
  );
};

const deleteController = async (req, res) => {
  await promocionBancariaService.deleteService(req);
  res.status(200).json(
    ResponseBuilder.success(null, "Promoción bancaria eliminada exitosamente", 204)
  );
};

module.exports = {
  getAllController,
  getByIdController,
  createController,
  updateController,
  deleteController
};
