const { Caracteristica } = require("../models");

async function findAll() {
  const rows = await Caracteristica.findAll();
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(id) {
  const row = await Caracteristica.findByPk(id);
  return row ? row.get({ plain: true }) : null;
}

module.exports = { findAll, findById };
