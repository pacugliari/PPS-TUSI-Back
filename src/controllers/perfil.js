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

module.exports = {
  getAllController,
  getByIdController,
};
