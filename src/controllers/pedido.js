const ResponseBuilder = require("../utils/api-response");
const { getAllService, getByIdService } = require("../services/pedido");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await getAllService(req),
      "Pedidos consultados exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await getByIdService(req),
      "Pedido consultado exitosamente"
    )
  );
};

module.exports = {
  getAllController,
  getByIdController
};
