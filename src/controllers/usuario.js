const ResponseBuilder = require("../utils/api-response");
const usuarioService = require("../services/usuario");

const getAllController = async (req, res) => {
  try {
    const usuarios = await usuarioService.getAllService(req);
    res.status(200).json(
      ResponseBuilder.success(
        usuarios,
        "Usuarios consultados exitosamente"
      )
    );
  } catch (err) {
    next(err);
  }
};

const getByIdController = async (req, res) => {
  try {
    const result = await usuarioService.getByIdService(req);
    res.status(200).json(
      ResponseBuilder.success(
        result,
        "Usuario consultado exitosamente"
      )
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllController,
  getByIdController,
};
