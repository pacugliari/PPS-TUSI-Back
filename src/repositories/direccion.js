const { Direccion, Usuario, Zona } = require("../models");

async function findAll() {
  const rows = await Direccion.findAll({
    include: [
      { model: Usuario, as: "usuario", attributes: ['idUsuario', 'email'] },
      { model: Zona, as: "zona", attributes: ['idZona', 'nombre'] }
    ]
  });
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(id) {
  const row = await Direccion.findByPk(id, {
    include: [
      { model: Usuario, as: "usuario", attributes: ['idUsuario', 'email'] },
      { model: Zona, as: "zona", attributes: ['idZona', 'nombre'] }
    ]
  });
  return row ? row.get({ plain: true }) : null;
}

module.exports = { findAll, findById };
