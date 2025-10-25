const ResponseBuilder = require("../utils/api-response");
const subcategoriaService = require("../services/subcategoria");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await subcategoriaService.getAllService(req),
      "Subcategorías consultadas exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await subcategoriaService.getByIdService(req),
      "Subcategoría consultada exitosamente"
    )
  );
};

const createController = async (req, res) => {
  res.status(201).json(
    ResponseBuilder.success(
      await subcategoriaService.createService(req),
      "Subcategoría creada exitosamente"
    )
  );
};

const updateController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await subcategoriaService.updateService(req),
      "Subcategoría actualizada exitosamente"
    )
  );
};

const deleteController = async (req, res) => {
  await subcategoriaService.deleteService(req);
  res
    .status(200)
    .json(ResponseBuilder.success(null, "Subcategoría eliminada exitosamente", 204));
};

const getOptionsController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await subcategoriaService.getOptionsService(req),
      "Opciones de subcategorías consultadas exitosamente"
    )
  );
};

module.exports = {
  getAllController,
  getByIdController,
  createController,
  updateController,
  deleteController,
  getOptionsController,
};
