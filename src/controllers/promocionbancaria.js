const ResponseBuilder = require("../utils/api-response");
const promocionBancariaService = require("../services/promocionbancaria");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await promocionBancariaService.getAllService(req),
      "Promociones bancarias consultadas exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await promocionBancariaService.getByIdService(req),
      "Promoción bancaria consultada exitosamente"
    )
  );
};

module.exports = {
  getAllController,
  getByIdController,
};
