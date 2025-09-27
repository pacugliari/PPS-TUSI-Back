const ResponseBuilder = require("../utils/api-response");
const perfilService = require("../services/perfil");

const getAllController = async (req, res) => {
  try {
    const perfiles = await perfilService.getAllService(req);
    res.status(200).json(
      ResponseBuilder.success(
        perfiles,
        "Perfiles consultados exitosamente"
      )
    );
  } catch (err) {
    next(err);
  }
};

const getByIdController = async (req, res) => {
  try {
    const result = await perfilService.getByIdService(req);
    res.status(200).json(
      ResponseBuilder.success(
        result,
        "Perfil consultado exitosamente"
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
