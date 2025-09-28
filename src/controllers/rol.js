const ResponseBuilder = require("../utils/api-response");
const rolService = require("../services/rol");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await rolService.getAllService(req),
      "Roles consultados exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await rolService.getByIdService(req),
      "Rol consultado exitosamente"
    )
  );
};

module.exports = {
  getAllController,
  getByIdController,
};
