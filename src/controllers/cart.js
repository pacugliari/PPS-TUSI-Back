const ResponseBuilder = require("../utils/api-response");
const productoService = require("../services/producto");

// POST /cart/products
const getCartProductsController = async (req, res) => {
  try {
    const { ids } = req.body || {};
    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json(ResponseBuilder.error("Debe enviar un array de ids", 400));
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
      .json(ResponseBuilder.error(err.message || "Error de servidor", status));
  }
};

module.exports = { getCartProductsController };
