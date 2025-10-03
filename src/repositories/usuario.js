const { Usuario } = require("../models");

async function findAll() {
  const rows = await Usuario.findAll({
    attributes: { exclude: ['password'] }
  });
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(id) {
  const row = await Usuario.findByPk(id, {
    attributes: { exclude: ['password'] }
  });
  return row ? row.get({ plain: true }) : null;
}

module.exports = { findAll, findById };
