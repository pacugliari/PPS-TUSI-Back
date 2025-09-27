const ResponseBuilder = require("../utils/api-response");
const propiedadService = require("../services/propiedad");

const getAllController = async (req, res) => {
  try {
    const propiedades = await propiedadService.getAllService(req);
    res.status(200).json(
      ResponseBuilder.success(
        propiedades,
        "Propiedades consultadas exitosamente"
      )
    );
  } catch (err) {
    next(err);
  }
};

const getByIdController = async (req, res) => {
  try {
    const result = await propiedadService.getByIdService(req);
    res.status(200).json(
      ResponseBuilder.success(
        result,
        "Propiedad consultada exitosamente"
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
