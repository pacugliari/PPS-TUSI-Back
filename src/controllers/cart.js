const ResponseBuilder = require("../utils/api-response");
const productoService = require("../services/producto");
const cuponService = require("../services/cupon");

// POST /cart/products
const getCartProductsController = async (req, res) => {
  try {
    const { ids } = req.body || {};
    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json(
          ResponseBuilder.error("Debe enviar un array de ids", [], 400)
        );
    }
    const products = await productoService.getByIdsService(ids);
    return res
      .status(200)
      .json(
        ResponseBuilder.success(products, "Productos consultados exitosamente")
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
// GET /cart/coupons/:code/validate
const validateCouponController = async (req, res) => {
  try {
    const result = await cuponService.validateCodeService(req);
    return res
      .status(200)
      .json(ResponseBuilder.success(result, "Cupón válido", 200));
  } catch (err) {
    const status = err.statusCode || 500;
    const message =
      status === 404
        ? "Cupón no encontrado"
        : status === 400
          ? "El cupón no es válido o ha expirado"
          : err.message || "Error de servidor";
    return res.status(status).json(ResponseBuilder.error(message, [], status));
  }
};

module.exports = { getCartProductsController, validateCouponController };
