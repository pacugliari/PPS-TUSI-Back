const ResponseBuilder = require("../utils/api-response");
const direccionService = require("../services/direccion");

const getAllController = async (req, res) => {
  try {
    const direcciones = await direccionService.getAllService(req);
    res.status(200).json(
      ResponseBuilder.success(
        direcciones,
        "Direcciones consultadas exitosamente"
      )
    );
  } catch (err) {
    next(err);
  }
};

const getByIdController = async (req, res) => {
  try {
    const result = await direccionService.getByIdService(req);
    res.status(200).json(
      ResponseBuilder.success(
        result,
        "Dirección consultada exitosamente"
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
