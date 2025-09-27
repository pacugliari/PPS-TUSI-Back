const ResponseBuilder = require("../utils/api-response");
const caracteristicaService = require("../services/caracteristica");

const getAllController = async (req, res) => {
  try {
    const result = await caracteristicaService.getAllService(req);
    res.status(200).json(
      ResponseBuilder.success(
        result,
        "Caracteristicas consultadas exitosamente"
      )
    );
  } catch (err) {
    next(err);
  }
};

const getByIdController = async (req, res) => {
  try {
    const result = await caracteristicaService.getByIdService(req);
    res.status(200).json(
      ResponseBuilder.success(
        result,
        "Caracteristica consultada exitosamente"
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
