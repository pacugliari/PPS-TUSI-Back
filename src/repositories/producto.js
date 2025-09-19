// src/repository/product.repository.js
const { Op, fn, col, literal } = require("sequelize");
const {
  Producto,
  Categoria,
  SubCategoria,
  Marca,
  Stock,
  Comentario,
  Propiedad,
  Caracteristica,
  Usuario
} = require("../models");

// ---- helpers internos solo del repo ----
const buildWhere = (filters = {}) => {
  const { q, categoryId, subcategoryId, brandId, minPrice, maxPrice } = filters;
  const where = {};
  if (q) {
    // iLike en Postgres; en MySQL podrías usar [Op.substring]
    where[Op.or] = [
      { nombre: { [Op.iLike]: `%${q}%` } },
      { descripcion: { [Op.iLike]: `%${q}%` } },
    ];
  }
  if (categoryId) where.idCategoria = Number(categoryId);
  if (subcategoryId) where.idSubCategoria = Number(subcategoryId);
  if (brandId) where.idMarca = Number(brandId);
  if (minPrice || maxPrice) {
    where.precio = {};
    if (minPrice) where.precio[Op.gte] = Number(minPrice);
    if (maxPrice) where.precio[Op.lte] = Number(maxPrice);
  }
  return where;
};

const buildOrder = (sort) => {
  const orderMap = {
    price_asc: [["precio", "ASC"]],
    price_desc: [["precio", "DESC"]],
    name_asc: [["nombre", "ASC"]],
    name_desc: [["nombre", "DESC"]],
    created_desc: [["createdAt", "DESC"]],
  };
  return orderMap[sort] || orderMap.created_desc;
};

const baseInclude = [
  { model: Categoria, as: "categoria", attributes: ["idCategoria", "nombre"] },
  {
    model: SubCategoria,
    as: "subcategoria",
    attributes: ["idSubCategoria", "nombre"],
  },
  { model: Marca, as: "marca", attributes: ["idMarca", "nombre"] },
  { model: Stock, as: "stockDetallado", attributes: ["stockActual", "estado"] },
  {
    model: Propiedad,
    as: "propiedades",
    attributes: ["idPropiedad", "idCaracteristica", "valor"],
    include: [
      {
        model: Caracteristica,
        as: "caracteristica",
        attributes: ["idCaracteristica", "descripcion"],
      },
    ],
  },
  {
    model: Comentario,
    as: "comentarios",
    attributes: ["idComentario", "puntuacion", "comentario", "createdAt"],
    include: [
      { model: Usuario, as: "usuario", attributes: ["idUsuario", "email"] },
    ],
    required: false, // no forzar join si no hay comentarios
  },
];

// ---- API del repositorio ----
async function findAll({
  page = 1,
  limit = 10,
  filters = {},
  sort = "created_desc",
} = {}) {
  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 10));
  const offset = (pageNum - 1) * limitNum;

  const where = buildWhere(filters);
  const order = buildOrder(sort);

  const { rows, count } = await Producto.findAndCountAll({
    where,
    include: [
      ...baseInclude,
      // Para evitar payload enorme no seleccionamos comentarios; si quisieras promedio:
      // { model: Comentario, as: "comentarios", attributes: [] }
    ],
    order,
    offset,
    limit: limitNum,
    distinct: true,
  });

  return {
    rows: rows.map((r) => r.get({ plain: true })),
    count,
    page: pageNum,
    limit: limitNum,
  };
}

async function findById(id) {
  const product = await Producto.findByPk(id, {
    include: [
      ...baseInclude,
      {
        model: Propiedad,
        as: "propiedades",
        attributes: ["idPropiedad", "valor"],
        include: [],
      },
      {
        model: Comentario,
        as: "comentarios",
        attributes: ["idComentario", "puntuacion", "comentario", "createdAt"],
      },
    ],
  });
  return product ? product.get({ plain: true }) : null;
}

async function create(data) {
  const created = await Producto.create(data);
  return created.get({ plain: true });
}

async function update(id, data) {
  const [updated] = await Producto.update(data, { where: { idProducto: id } });
  if (!updated) return null;
  return findById(id);
}

async function remove(id) {
  return await Producto.destroy({ where: { idProducto: id } }); // devuelve count
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
