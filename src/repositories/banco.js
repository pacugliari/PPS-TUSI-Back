const { Banco } = require("../models");

async function findAll() {
  const rows = await Banco.findAll();
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(id) {
  const row = await Banco.findByPk(id);
  return row ? row.get({ plain: true }) : null;
}

async function findOne(where) {
  const row = await Banco.findOne({ where });
  return row ? row.get({ plain: true }) : null;
}

async function create(data) {
  const row = await Banco.create(data);
  return row.get({ plain: true });
}

async function update(id, data) {
  const [updated] = await Banco.update(data, {
    where: { idBanco: id }
  });
  if (!updated) return null;
  return await findById(id);
}

module.exports = {
  findAll,
  findById,
  findOne,
  create,
  update,
};
