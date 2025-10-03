const { Zona } = require("../models");

async function findAll() {
  const rows = await Zona.findAll();
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(id) {
  const row = await Zona.findByPk(id);
  return row ? row.get({ plain: true }) : null;
}

module.exports = { findAll, findById };
