const ResponseBuilder = require("../utils/api-response");
const perfilService = require("../services/perfil");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await perfilService.getAllService(req),
      "Perfiles consultados exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await perfilService.getByIdService(req),
      "Perfil consultado exitosamente"
    )
  );
};

const createController = async (req, res) => {
  res.status(201).json(
    ResponseBuilder.success(
      await perfilService.createService(req),
      "Perfil creado exitosamente"
    )
  );
};

const updateController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await perfilService.updateService(req),
      "Perfil actualizado exitosamente"
    )
  );
};

const deleteController = async (req, res) => {
  await perfilService.deleteService(req);
  res.status(200).json(
    ResponseBuilder.success(null, "Perfil eliminado exitosamente", 204)
  );
};

module.exports = {
  getAllController,
  getByIdController,
  createController,
  updateController,
  deleteController,
};
