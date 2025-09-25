const ResponseBuilder = require("../utils/api-response");
const zonaService = require("../services/zona");

const getAllController = async (req, res) => {
  try {
    const zonas = await zonaService.getAllService(req);
    res.status(200).json(
      ResponseBuilder.success(
        zonas,
        "Zonas consultadas exitosamente"
      )
    );
  } catch (err) {
    next(err);
  }
};

const getByIdController = async (req, res) => {
  try {
    const result = await zonaService.getByIdService(req);
    res.status(200).json(
      ResponseBuilder.success(
        result,
        "Zona consultada exitosamente"
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
