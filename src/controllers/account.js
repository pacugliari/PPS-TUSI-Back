const direccionService = require("../services/direccion");
const zonaService = require("../services/zona");
const bancoService = require("../services/banco");
const productoService = require("../services/producto");
const tarjetaService = require("../services/tarjeta");
const perfilService = require("../services/perfil");
const pedidoService = require("../services/pedido");
const comentarioService = require("../services/comentario");
const accountService = require("../services/account");
const ResponseBuilder = require("../utils/api-response");
const { transitionService } = require("../services/pedido");
const { ROLES } = require("../constants/roles");
const { ESTADOS_PEDIDOS } = require("../constants/pedidos");
const devolucionService = require("../services/devolucion");

const getAccountAddressesController = async (req, res) => {
  try {
    const result = await direccionService.getByUserService(req);
    res
      .status(200)
      .json(
        ResponseBuilder.success(
          result,
          "Direcciones del usuario consultadas exitosamente"
        )
      );
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json(ResponseBuilder.error(err.message, status));
  }
};

const getFavoritesController = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res
        .status(400)
        .json(ResponseBuilder.error("Debe enviar un array de ids", 400));
    }
    const result = await productoService.getByIdsService(ids);
    res
      .status(200)
      .json(
        ResponseBuilder.success(
          result,
          "Productos favoritos consultados exitosamente"
        )
      );
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json(ResponseBuilder.error(err.message, status));
  }
};

const postAccountAddressController = async (req, res) => {
  try {
    const result = await direccionService.createService(req);
    res
      .status(201)
      .json(
        ResponseBuilder.success(result, "Dirección creada exitosamente", 201)
      );
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json(ResponseBuilder.error(err.message, status));
  }
};

const putAccountAddressController = async (req, res) => {
  try {
    // Opcional: podrías validar que la dirección pertenezca al usuario
    const result = await direccionService.updateService(req);
    res
      .status(200)
      .json(
        ResponseBuilder.success(result, "Dirección actualizada exitosamente")
      );
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json(ResponseBuilder.error(err.message, status));
  }
};

const deleteAccountAddressController = async (req, res) => {
  try {
    await direccionService.deleteService(req);
    res
      .status(200)
      .json(ResponseBuilder.success("Dirección borrada exitosamente"));
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json(ResponseBuilder.error(err.message, status));
  }
};

const setPrimaryAddressController = async (req, res) => {
  try {
    const result = await direccionService.setPrimaryService(req);
    res
      .status(200)
      .json(
        ResponseBuilder.success(
          result,
          "Dirección principal actualizada exitosamente"
        )
      );
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json(ResponseBuilder.error(err.message, status));
  }
};

const getAccountAddressesOptionsController = async (req, res) => {
  try {
    const result = await zonaService.getAllService(req);
    res
      .status(200)
      .json(ResponseBuilder.success(result, "Zonas consultadas exitosamente"));
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json(ResponseBuilder.error(err.message, status));
  }
};

const getCardsController = async (req, res) => {
  try {
    const result = await tarjetaService.getByUserService(req);
    res
      .status(200)
      .json(
        ResponseBuilder.success(result, "Tarjetas consultadas exitosamente")
      );
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json(ResponseBuilder.error(err.message, status));
  }
};

const getPurchasesDetailController = async (req, res) => {
  try {
    const detail = await pedidoService.getOrderDetailByIdService(req);
    res
      .status(200)
      .json(
        ResponseBuilder.success(
          detail,
          "Detalle de pedido consultado exitosamente"
        )
      );
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json(ResponseBuilder.error(err.message, status));
  }
};

const postCardsController = async (req, res) => {
  try {
    const result = await tarjetaService.createService(req);
    res
      .status(201)
      .json(
        ResponseBuilder.success(result, "Tarjeta creada exitosamente", 201)
      );
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json(ResponseBuilder.error(err.message, status));
  }
};

const deleteCardsController = async (req, res) => {
  try {
    await tarjetaService.deleteService(req);
    res
      .status(200)
      .json(ResponseBuilder.success("Tarjeta borrada exitosamente"));
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json(ResponseBuilder.error(err.message, status));
  }
};

const getCardsOptionsController = async (req, res) => {
  try {
    const result = await bancoService.getAllService(req);
    res
      .status(200)
      .json(ResponseBuilder.success(result, "Bancos consultadas exitosamente"));
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json(ResponseBuilder.error(err.message, status));
  }
};

const getProfileController = async (req, res) => {
  try {
    const result = await perfilService.getProfileService(req);
    res
      .status(200)
      .json(ResponseBuilder.success(result, "Perfil obtenido correctamente"));
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json(ResponseBuilder.error(err.message, status));
  }
};

const putProfileController = async (req, res) => {
  try {
    const result = await perfilService.putProfileService(req);
    res
      .status(200)
      .json(
        ResponseBuilder.success(result, "Perfil actualizado correctamente")
      );
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json(ResponseBuilder.error(err.message, status));
  }
};

const getPurchasesController = async (req, res) => {
  try {
    const orders = await pedidoService.getOrdersByUserService(req);
    res
      .status(200)
      .json(
        ResponseBuilder.success(orders, "Pedidos consultados exitosamente")
      );
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json(ResponseBuilder.error(err.message, status));
  }
};

const postPurchasesRateController = async (req, res) => {
  try {
    const result = await comentarioService.createService(req);
    res
      .status(201)
      .json(
        ResponseBuilder.success(
          result,
          "Calificación registrada exitosamente",
          201
        )
      );
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json(ResponseBuilder.error(err.message, status));
  }
};

const getProductsController = async (req, res) => {
  try {
    const result = await accountService.getAllService(req);
    res
      .status(200)
      .json(
        ResponseBuilder.success(result, "Productos consultados exitosamente")
      );
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json(ResponseBuilder.error(err.message, status));
  }
};

const getProductsOptionsController = async (req, res) => {
  try {
    const result = await accountService.getOptionsService(req);
    res
      .status(200)
      .json(
        ResponseBuilder.success(
          result,
          "Opciones de productos consultadas exitosamente"
        )
      );
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json(ResponseBuilder.error(err.message, status));
  }
};

const postProductController = async (req, res) => {
  try {
    const result = await accountService.createService(req);
    const { fotoErrors, ...payload } = result || {};
    const errors =
      Array.isArray(fotoErrors) && fotoErrors.length ? fotoErrors : undefined;
    res
      .status(201)
      .json(
        ResponseBuilder.success(
          payload,
          "Producto creado exitosamente",
          201,
          errors
        )
      );
  } catch (err) {
    const status = err.statusCode || 500;
    res
      .status(status)
      .json(ResponseBuilder.error(err.message, err.errors || [], status));
  }
};

const putProductController = async (req, res) => {
  try {
    const result = await accountService.updateService(req);
    const { fotoErrors, ...payload } = result || {};
    const errors =
      Array.isArray(fotoErrors) && fotoErrors.length ? fotoErrors : undefined;
    res
      .status(200)
      .json(
        ResponseBuilder.success(
          payload,
          "Producto actualizado exitosamente",
          200,
          errors
        )
      );
  } catch (err) {
    const status = err.statusCode || 500;
    res
      .status(status)
      .json(ResponseBuilder.error(err.message, err.errors || [], status));
  }
};

const deleteProductController = async (req, res) => {
  try {
    await accountService.deleteService(req);
    res
      .status(200)
      .json(ResponseBuilder.success("Producto eliminado exitosamente"));
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json(ResponseBuilder.error(err.message, status));
  }
};

const getOrdersController = async (req, res) => {
  const rol = req.user?.role;
  const orders = await pedidoService.getAllService();

  const filteredOrders =
    rol === ROLES.DELIVERY
      ? orders.filter(
          (o) => String(o.estado).toLowerCase() === ESTADOS_PEDIDOS.ENVIADO
        )
      : orders;

  return res
    .status(200)
    .json(
      ResponseBuilder.success(
        filteredOrders,
        "Pedidos consultados exitosamente"
      )
    );
};

const getOrderDetailController = async (req, res) => {
  const detail = await pedidoService.getByIdService(req);
  res
    .status(200)
    .json(
      ResponseBuilder.success(
        detail,
        "Detalle de pedido consultado exitosamente"
      )
    );
};

const postOrdersCancelController = async (req, res) => {
  const data = await transitionService(req);
  res
    .status(200)
    .json(ResponseBuilder.success(data, "Pedido cancelado correctamente"));
};

const postOrdersSentController = async (req, res) => {
  const data = await transitionService(req);
  res
    .status(200)
    .json(ResponseBuilder.success(data, "Pedido enviado correctamente"));
};

const postOrdersDeliveredController = async (req, res) => {
  const data = await transitionService(req);
  res
    .status(200)
    .json(ResponseBuilder.success(data, "Pedido entregado correctamente"));
};

const postPurchasesReturnController = async (req, res) => {
  const result = await devolucionService.createService(req);
  res
    .status(201)
    .json(
      ResponseBuilder.success(result, "Devolución registrada exitosamente", 201)
    );
};

module.exports = {
  getAccountAddressesController,
  getFavoritesController,
  postAccountAddressController,
  putAccountAddressController,
  deleteAccountAddressController,
  setPrimaryAddressController,
  getAccountAddressesOptionsController,
  getCardsController,
  postCardsController,
  deleteCardsController,
  getCardsOptionsController,
  getProfileController,
  putProfileController,
  getPurchasesController,
  getPurchasesDetailController,
  postPurchasesRateController,
  getProductsController,
  getProductsOptionsController,
  postProductController,
  putProductController,
  deleteProductController,
  getOrdersController,
  getOrderDetailController,
  postOrdersCancelController,
  postOrdersSentController,
  postOrdersDeliveredController,
  postPurchasesReturnController,
};
