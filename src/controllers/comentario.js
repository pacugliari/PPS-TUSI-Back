const ResponseBuilder = require("../utils/api-response");
const comentarioService = require("../services/comentario");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await comentarioService.getAllService(req),
      "Comentarios consultados exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await comentarioService.getByIdService(req),
      "Comentario consultado exitosamente"
    )
  );
};

const createController = async (req, res) => {
  res.status(201).json(
    ResponseBuilder.success(
      await comentarioService.createService(req),
      "Comentario creado exitosamente"
    )
  );
};

const updateController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await comentarioService.updateService(req),
      "Comentario actualizado exitosamente"
    )
  );
};

const deleteController = async (req, res) => {
  await comentarioService.deleteService(req);
  res.status(200).json(
    ResponseBuilder.success(null, "Comentario eliminado exitosamente")
  );
};

module.exports = {
  getAllController,
  getByIdController,
  createController,
  updateController,
  deleteController,
};
