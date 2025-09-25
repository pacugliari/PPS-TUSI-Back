const { PromocionBancaria, Banco } = require("../models");

async function findAll() {
  const rows = await PromocionBancaria.findAll({
    include: [
      { model: Banco, as: "banco", attributes: ['idBanco', 'nombre'] }
    ]
  });
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(id) {
  const row = await PromocionBancaria.findByPk(id, {
    include: [
      { model: Banco, as: "banco", attributes: ['idBanco', 'nombre'] }
    ]
  });
  return row ? row.get({ plain: true }) : null;
}

module.exports = { findAll, findById };
