const { Perfil, Usuario } = require("../models");

async function findAll() {
  const rows = await Perfil.findAll({
    include: [
      { model: Usuario, as: "usuario", attributes: ['idUsuario', 'email'] }
    ]
  });
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(id) {
  const row = await Perfil.findByPk(id, {
    include: [
      { model: Usuario, as: "usuario", attributes: ['idUsuario', 'email'] }
    ]
  });
  return row ? row.get({ plain: true }) : null;
}

module.exports = { findAll, findById };
