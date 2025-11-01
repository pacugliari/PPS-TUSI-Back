const ResponseBuilder = require("../utils/api-response");
const perfilService = require("../services/perfil");
const direccionService = require("../services/direccion");
const checkoutService = require("../services/checkout");

const getCheckoutOptionsController = async (req, res) => {
  try {
    const perfil = await perfilService.getFullProfileByUserService(req);
    const direcciones = await direccionService.getCheckoutAddressesService(req);

    const payload = { perfil, direcciones };
    return res
      .status(200)
      .json(
        ResponseBuilder.success(
          payload,
          "Opciones de checkout consultadas exitosamente",
          200
        )
      );
  } catch (err) {
    const status = err.statusCode || 500;
    return res
      .status(status)
      .json(
        ResponseBuilder.error(err.message || "Error de servidor", [], status)
      );
  }
};

const validateCardController = async (req, res) => {
  const payload = await checkoutService.validateCardService(req);

  return res
    .status(200)
    .json(
      ResponseBuilder.success(payload, "Tarjeta validada exitosamente", 200)
    );
};

const createPedidoController = async (req, res) => {
  const pedido = await checkoutService.createOrderService(req);
  return res
    .status(201)
    .json(ResponseBuilder.success(pedido, "Pedido creado exitosamente", 201));
};

module.exports = {
  getCheckoutOptionsController,
  validateCardController,
  createPedidoController,
};
