const ResponseBuilder = require("../utils/api-response");
const bancoService = require("../services/banco");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await bancoService.getAllService(req),
      "Bancos consultados exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await bancoService.getByIdService(req),
      "Banco consultado exitosamente"
    )
  );
};

module.exports = {
  getAllController,
  getByIdController,
};
