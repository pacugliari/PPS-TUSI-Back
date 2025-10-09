const ResponseBuilder = require("../utils/api-response");
const marcaService = require("../services/marca");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await marcaService.getAllService(req),
      "Marcas consultadas exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await marcaService.getByIdService(req),
      "Marca consultada exitosamente"
    )
  );
};

const createController = async (req, res) => {
  res.status(201).json(
    ResponseBuilder.success(
      await marcaService.createService(req),
      "Marca creada exitosamente"
    )
  );
};

const updateController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await marcaService.updateService(req),
      "Marca actualizada exitosamente"
    )
  );
};

const deleteController = async (req, res) => {
  await marcaService.deleteService(req);
  res.status(200).json(
    ResponseBuilder.success(null, "Marca eliminada exitosamente")
  );
};

module.exports = {
  getAllController,
  getByIdController,
  createController,
  updateController,
  deleteController,
};
