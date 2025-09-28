const ResponseBuilder = require("../utils/api-response");
const usuarioService = require("../services/usuario");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await usuarioService.getAllService(req),
      "Usuarios consultados exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await usuarioService.getByIdService(req),
      "Usuario consultado exitosamente"
    )
  );
};

module.exports = {
  getAllController,
  getByIdController,
};
