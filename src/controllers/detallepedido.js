const ResponseBuilder = require("../utils/api-response");
const detallePedidoService = require("../services/detallepedido");

const getAllController = async (req, res) => {
  try {
    const detalles = await detallePedidoService.getAllService(req);
    res.status(200).json(
      ResponseBuilder.success(
        detalles,
        "Detalles de pedidos consultados exitosamente"
      )
    );
  } catch (err) {
    next(err);
  }
};

const getByIdController = async (req, res) => {
  try {
    const result = await detallePedidoService.getByIdService(req);
    res.status(200).json(
      ResponseBuilder.success(
        result,
        "Detalle de pedido consultado exitosamente"
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
