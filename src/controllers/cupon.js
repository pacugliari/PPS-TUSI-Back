const ResponseBuilder = require("../utils/api-response");
const cuponService = require("../services/cupon");

const getAllController = async (req, res) => {
  try {
    const cupones = await cuponService.getAllService(req);
    res.status(200).json(
      ResponseBuilder.success(
        cupones,
        "Cupones consultados exitosamente"
      )
    );
  } catch (err) {
    next(err);
  }
};

const getByIdController = async (req, res) => {
  try {
    const result = await cuponService.getByIdService(req);
    res.status(200).json(
      ResponseBuilder.success(
        result,
        "Cupón consultado exitosamente"
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
