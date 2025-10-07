const HttpError = require("../utils/http-error");
const productoRepository = require("../repositories/producto");
const { DetallePedido, Producto, Categoria } = require("../models");

const getAllService = async (req) => {
  try {
    const { rows } = await productoRepository.findAll();

    return rows;
  } catch (err) {
    throw new HttpError(500, "No se pudieron obtener los productos");
  }
};

const getByIdService = async (req) => {
  const { id } = req.params;
  const product = await productoRepository.findById(id);
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

const createService = async (req) => {
  const {
    idCategoria,
    idSubCategoria,
    idMarca,
    nombre,
    precio,
    descripcion,
    stock,
    fotos
  } = req.body;

  // Validaciones
  const requiredFields = ['nombre', 'precio', 'idCategoria', 'idMarca'];
  const errors = [];

  requiredFields.forEach(field => {
    if (!req.body[field]) {
      errors.push({ [field]: `El campo ${field} es requerido` });
    }
  });

  if (errors.length > 0) {
    throw new HttpError(400, "Faltan campos requeridos").setErrors(errors);
  }

  if (precio <= 0) {
    throw new HttpError(400, "El precio debe ser mayor a cero").setErrors([
      { precio: "El precio debe ser mayor a cero" }
    ]);
  }

  const product = await productoRepository.create({
    idCategoria,
    idSubCategoria,
    idMarca,
    nombre,
    precio,
    descripcion,
    stock,
    fotos: Array.isArray(fotos) ? fotos : [],
  });

  return product;
};

const updateService = async (req) => {
  const { id } = req.params;
  const {
    idCategoria,
    idSubCategoria,
    idMarca,
    nombre,
    precio,
    descripcion,
    stock,
    fotos
  } = req.body;

  // Verificar si existe
  const productoExistente = await productoRepository.findById(id);
  if (!productoExistente) {
    throw new HttpError(404, "Producto no encontrado");
  }

  // Validaciones para campos que se vayan a actualizar
  const errors = [];

  if (precio !== undefined && precio <= 0) {
    errors.push({ precio: "El precio debe ser mayor a cero" });
  }

  if (errors.length > 0) {
    throw new HttpError(400, "Datos inválidos").setErrors(errors);
  }

  const updateData = {};
  if (idCategoria !== undefined) updateData.idCategoria = idCategoria;
  if (idSubCategoria !== undefined) updateData.idSubCategoria = idSubCategoria;
  if (idMarca !== undefined) updateData.idMarca = idMarca;
  if (nombre !== undefined) updateData.nombre = nombre;
  updateData.precio = precio;
  updateData.precioAnterior = productoExistente.precio;
  if (descripcion !== undefined) updateData.descripcion = descripcion;
  if (stock !== undefined) updateData.stock = stock;
  if (fotos !== undefined) updateData.fotos = Array.isArray(fotos) ? fotos : [];

  const updatedProduct = await productoRepository.update(id, updateData);
  return updatedProduct;
};

const deleteService = async (req) => {
  const { id } = req.params;
  const product = await productoRepository.findById(id);
  if (!product) throw new HttpError(404, "Producto no encontrado");
  await productoRepository.remove(id);
  return true;
};

module.exports = {
  getAllService,
  getByIdService,
  getPopularProductsService,
  getLatestProductsService,
  createService,
  updateService,
  deleteService,
};
