const ResponseBuilder = require("../utils/api-response");
const rolService = require("../services/rol");

const getAllController = async (req, res) => {
  try {
    const roles = await rolService.getAllService(req);
    res.status(200).json(
      ResponseBuilder.success(
        roles,
        "Roles consultados exitosamente"
      )
    );
  } catch (err) {
    next(err);
  }
};

const getByIdController = async (req, res) => {
  try {
    const result = await rolService.getByIdService(req);
    res.status(200).json(
      ResponseBuilder.success(
        result,
        "Rol consultado exitosamente"
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
