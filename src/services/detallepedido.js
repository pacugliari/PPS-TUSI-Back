const HttpError = require("../utils/http-error");
const detallePedidoRepository = require("../repositories/detallepedido");

const getAllService = async (req) => {
  try {
    const { rows } = await detallePedidoRepository.findAll();
    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener los detalles de pedido");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const detalle = await detallePedidoRepository.findById(id);
  if (!detalle) throw new HttpError(404, "Detalle de pedido no encontrado");
  return { data: detalle };
};

module.exports = {
  getAllService,
  getByIdService,
};
