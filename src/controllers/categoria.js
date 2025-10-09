const ResponseBuilder = require("../utils/api-response");
const categoriaService = require("../services/categoria");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await categoriaService.getAllService(req),
      "Categorias consultadas exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await categoriaService.getByIdService(req),
      "Categoria consultada exitosamente"
    )
  );
};

const createController = async (req, res) => {
  res.status(201).json(
    ResponseBuilder.success(
      await categoriaService.createService(req),
      "Categoría creada exitosamente"
    )
  );
};

const updateController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await categoriaService.updateService(req),
      "Categoría actualizada exitosamente"
    )
  );
};

const deleteController = async (req, res) => {
  await categoriaService.deleteService(req);
  res.status(200).json(
    ResponseBuilder.success(null, "Categoría eliminada exitosamente")
  );
};

module.exports = {
  getAllController,
  getByIdController,
  createController,
  updateController,
  deleteController,
};
