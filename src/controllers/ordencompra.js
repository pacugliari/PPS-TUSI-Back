const ResponseBuilder = require("../utils/api-response");
const { getAllService, getByIdService } = require("../services/ordencompra");

const getAllController = async (req, res) => {
  res
    .status(200)
    .json(
      ResponseBuilder.success(
        await getAllService(req),
        "Ordenes de Compras consultadas exitosamente"
      )
    );
};

const getByIdController = async (req, res) => {
  res
    .status(200)
    .json(
      ResponseBuilder.success(
        await getByIdService(req),
        "Orden de Compra consultada exitosamente"
      )
    );
};

module.exports = {
    getAllController,
    getByIdController
};
