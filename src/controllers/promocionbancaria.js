const ResponseBuilder = require("../utils/api-response");
const promocionBancariaService = require("../services/promocionbancaria");

const getAllController = async (req, res) => {
  try {
    const promociones = await promocionBancariaService.getAllService(req);
    res.status(200).json(
      ResponseBuilder.success(
        promociones,
        "Promociones bancarias consultadas exitosamente"
      )
    );
  } catch (err) {
    next(err);
  }
};

const getByIdController = async (req, res) => {
  try {
    const result = await promocionBancariaService.getByIdService(req);
    res.status(200).json(
      ResponseBuilder.success(
        result,
        "Promoción bancaria consultada exitosamente"
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
