const ResponseBuilder = require("../utils/api-response");
const stockService = require("../services/stock");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await stockService.getAllService(req),
      "Stocks consultados exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await stockService.getByIdService(req),
      "Stock consultado exitosamente"
    )
  );
};

module.exports = {
  getAllController,
  getByIdController,
};
