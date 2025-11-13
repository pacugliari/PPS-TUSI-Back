const ResponseBuilder = require("../utils/api-response");
const productoService = require("../services/producto");

const carouselPrincipalService = require("../services/carrusel_principal");
const carouselMarcasService = require("../services/carrusel_marcas");

const getPopularProductsController = async (req, res) => {
  const productos = await productoService.getPopularProductsService();
  res
    .status(200)
    .json(
      ResponseBuilder.success(productos, "Productos consultados exitosamente")
    );
};

const getLatestProductsController = async (req, res) => {
  const productos = await productoService.getLatestProductsService();
  res
    .status(200)
    .json(
      ResponseBuilder.success(productos, "Productos consultados exitosamente")
    );
};

const getCarouselPrincipalController = async (req, res) => {
  const slides = await carouselPrincipalService.getAllService();
  res
    .status(200)
    .json(ResponseBuilder.success(slides, "Slides obtenidos correctamente"));
};

const getCarouselMarcasController = async (req, res) => {
  const marcas = await carouselMarcasService.getAllService();
  res
    .status(200)
    .json(ResponseBuilder.success(marcas, "Marcas del carrusel obtenidas"));
};

module.exports = {
  getPopularProductsController,
  getLatestProductsController,
  getCarouselPrincipalController,
  getCarouselMarcasController,
};
