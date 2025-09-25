const { Tarjeta, Usuario, Banco } = require("../models");

async function findAll() {
  const rows = await Tarjeta.findAll({
    include: [
      { model: Usuario, as: "usuario", attributes: ['idUsuario', 'email'] },
      { model: Banco, as: "banco", attributes: ['idBanco', 'nombre'] }
    ]
  });
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(id) {
  const row = await Tarjeta.findByPk(id, {
    include: [
      { model: Usuario, as: "usuario", attributes: ['idUsuario', 'email'] },
      { model: Banco, as: "banco", attributes: ['idBanco', 'nombre'] }
    ]
  });
  return row ? row.get({ plain: true }) : null;
}

module.exports = { findAll, findById };
