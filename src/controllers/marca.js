const ResponseBuilder = require("../utils/api-response");
const marcaService = require("../services/marca");

const getAllController = async (req, res) => {
  try {
    const marcas = await marcaService.getAllService(req);
    res.status(200).json(
      ResponseBuilder.success(
        marcas,
        "Marcas consultadas exitosamente"
      )
    );
  } catch (err) {
    next(err);
  }
};

const getByIdController = async (req, res) => {
  try {
    const result = await marcaService.getByIdService(req);
    res.status(200).json(
      ResponseBuilder.success(
        result,
        "Marca consultada exitosamente"
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
