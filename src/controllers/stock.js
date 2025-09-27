const ResponseBuilder = require("../utils/api-response");
const stockService = require("../services/stock");

const getAllController = async (req, res) => {
  try {
    const stocks = await stockService.getAllService(req);
    res.status(200).json(
      ResponseBuilder.success(
        stocks,
        "Stocks consultados exitosamente"
      )
    );
  } catch (err) {
    next(err);
  }
};

const getByIdController = async (req, res) => {
  try {
    const result = await stockService.getByIdService(req);
    res.status(200).json(
      ResponseBuilder.success(
        result,
        "Stock consultado exitosamente"
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
