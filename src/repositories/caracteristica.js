const { Caracteristica } = require("../models");

async function findAll() {
  const rows = await Caracteristica.findAll();
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(id) {
  const row = await Caracteristica.findByPk(id);
  return row ? row.get({ plain: true }) : null;
}

async function create(data) {
  const row = await Caracteristica.create(data);
  const created = await findById(row.idCaracteristica);
  return created;
}

async function update(id, data) {
  const [updated] = await Caracteristica.update(data, {
    where: { idCaracteristica: id }
  });
  if (!updated) return null;
  return await findById(id);
}

async function remove(id) {
  return await Caracteristica.destroy({ where: { idCaracteristica: id } });
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
