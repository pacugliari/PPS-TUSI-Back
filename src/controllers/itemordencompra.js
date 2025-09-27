const ResponseBuilder = require("../utils/api-response");
const { getAllService, getByIdService } = require("../services/itemordencompra");

const getAllController = async (req, res) => {
  res
    .status(200)
    .json(
      ResponseBuilder.success(
        await getAllService(req),
        "Items de Ordenes de Compra consultados exitosamente"
      )
    );
};

const getByIdController = async (req, res) => {
  res
    .status(200)
    .json(
      ResponseBuilder.success(
        await getByIdService(req),
        "Item Orden de Compra consultado exitosamente"
      )
    );
};

module.exports = {
    getAllController,
    getByIdController
};
