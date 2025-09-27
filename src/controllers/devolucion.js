const ResponseBuilder = require("../utils/api-response");
const { getAllService, getByIdService } = require("../services/devolucion");

const getAllController = async (req, res) => {
  res
    .status(200)
    .json(
      ResponseBuilder.success(
        await getAllService(req),
        "Devoluciones consultadas exitosamente"
      )
    );
};

const getByIdController = async (req, res) => {
  res
    .status(200)
    .json(
      ResponseBuilder.success(
        await getByIdService(req),
        "Devolución consultada exitosamente"
      )
    );
};

module.exports = {
    getAllController,
    getByIdController
};
