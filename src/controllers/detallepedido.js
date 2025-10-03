const ResponseBuilder = require("../utils/api-response");
const detallePedidoService = require("../services/detallepedido");

const getAllController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await detallePedidoService.getAllService(req),
      "Detalles de pedidos consultados exitosamente"
    )
  );
};

const getByIdController = async (req, res) => {
  res.status(200).json(
    ResponseBuilder.success(
      await detallePedidoService.getByIdService(req),
      "Detalle de pedido consultado exitosamente"
    )
  );
};

module.exports = {
  getAllController,
  getByIdController,
};
