const ResponseBuilder = require("../utils/api-response");
const productoService = require("../services/producto");

const getPopularProductsController = async (req, res) => {
    const productos = await productoService.getPopularProductsService();
    res.status(200).json(
        ResponseBuilder.success(productos, "Productos consultados exitosamente")
    );
};

const getLatestProductsController = async (req, res) => {
    const productos = await productoService.getLatestProductsService();
    res.status(200).json(
        ResponseBuilder.success(productos, "Productos consultados exitosamente")
    );
};

module.exports = {
    getPopularProductsController,
    getLatestProductsController,
};
