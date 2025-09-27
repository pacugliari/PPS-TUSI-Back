const ResponseBuilder = require("../utils/api-response");
const tarjetaService = require("../services/tarjeta");

const getAllController = async (req, res) => {
  try {
    const tarjetas = await tarjetaService.getAllService(req);
    res.status(200).json(
      ResponseBuilder.success(
        tarjetas,
        "Tarjetas consultadas exitosamente"
      )
    );
  } catch (err) {
    next(err);
  }
};

const getByIdController = async (req, res) => {
  try {
    const result = await tarjetaService.getByIdService(req);
    res.status(200).json(
      ResponseBuilder.success(
        result,
        "Tarjeta consultada exitosamente"
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
