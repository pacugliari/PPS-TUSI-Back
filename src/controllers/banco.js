const ResponseBuilder = require("../utils/api-response");
const bancoService = require("../services/banco");

const getAllController = async (req, res) => {
  try {
    const result = await bancoService.getAllService(req);
    res.status(200).json(
      ResponseBuilder.success(
        result,
        "Bancos consultados exitosamente"
      )
    );
  } catch (err) {
    next(err);
  }
};

const getByIdController = async (req, res) => {
  try {
    const result = await bancoService.getByIdService(req);
    res.status(200).json(
      ResponseBuilder.success(
        result,
        "Banco consultado exitosamente"
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
