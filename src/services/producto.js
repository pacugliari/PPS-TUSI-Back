const HttpError = require("../utils/http-error");
const productRepository = require("../repositories/producto");
const { DetallePedido, Producto, Categoria } = require("../models");

const getAllService = async (req) => {
  try {
    const { rows } = await productRepository.findAll();

    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener los productos");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const product = await productRepository.findById(id);
  if (!product) throw new HttpError(404, "Producto no encontrado");
  return { data: product };
};

const getPopularProductsService = async () => {
  // Consulta los productos más vendidos usando DetallePedido
  const results = await DetallePedido.findAll({
    attributes: [
      'idProducto',
      [Producto.sequelize.fn('SUM', Producto.sequelize.col('cantidad')), 'totalVendidos']
    ],
    include: [
      {
        model: Producto,
        as: 'producto',
        attributes: ['idProducto', 'nombre', 'fotos', 'precio', 'precioAnterior', 'idCategoria'],
        include: [{ model: Categoria, as: 'categoria', attributes: ['idCategoria', 'nombre'] }]
      }
    ],
    group: ['idProducto', 'producto.idProducto', 'producto->categoria.idCategoria'],
    order: [[Producto.sequelize.literal('totalVendidos'), 'DESC']],
    limit: 4
  });

  return results.map(r => {
    const prod = r.producto;
    return {
      idProducto: prod.idProducto,
      fotos: prod.fotos,
      nombre: prod.nombre,
      categoria: prod.categoria,
      precio: prod.precio,
      precioAnterior: prod.precioAnterior
    };
  });
};

const getLatestProductsService = async () => {
  // Consulta los productos más recientes (últimos agregados)
  const results = await Producto.findAll({
    attributes: ['idProducto', 'nombre', 'fotos', 'precio', 'precioAnterior', 'idCategoria'],
    include: [{ model: Categoria, as: 'categoria', attributes: ['idCategoria', 'nombre'] }],
    order: [['createdAt', 'DESC']],
    limit: 4
  });

  return results.map(prod => ({
    idProducto: prod.idProducto,
    fotos: prod.fotos,
    nombre: prod.nombre,
    categoria: prod.categoria,
    precio: prod.precio,
    precioAnterior: prod.precioAnterior
  }));
};

module.exports = {
  getAllService,
  getByIdService,
  getPopularProductsService,
  getLatestProductsService,
};
