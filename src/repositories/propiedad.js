const { Propiedad, Producto, Caracteristica } = require("../models");

async function findAll() {
  const rows = await Propiedad.findAll({
    include: [
      { model: Producto, as: "producto", attributes: ['idProducto', 'nombre'] },
      { model: Caracteristica, as: "caracteristica", attributes: ['idCaracteristica', 'descripcion'] }
    ]
  });
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(id) {
  const row = await Propiedad.findByPk(id, {
    include: [
      { model: Producto, as: "producto", attributes: ['idProducto', 'nombre'] },
      { model: Caracteristica, as: "caracteristica", attributes: ['idCaracteristica', 'descripcion'] }
    ]
  });
  return row ? row.get({ plain: true }) : null;
}

module.exports = { findAll, findById };
