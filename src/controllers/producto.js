const ResponseBuilder = require("../utils/api-response");
const productoService = require("../services/producto");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await productoService.getAllService(req),
      "Productos consultados exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await productoService.getByIdService(req),
      "Producto consultado exitosamente"
    )
  );
};

const createController = async (req, res) => {
  res.status(201).json(
    ResponseBuilder.success(
      await productoService.createService(req),
      "Producto creado exitosamente"
    )
  );
};

const updateController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await productoService.updateService(req),
      "Producto actualizado exitosamente"
    )
  );
};

const deleteController = async (req, res) => {
  await productoService.deleteService(req);
  res.status(200).json(
    ResponseBuilder.success(null, "Producto eliminado exitosamente")
  );
};

module.exports = {
  getAllController,
  getByIdController,
  createController,
  updateController,
  deleteController,
};
