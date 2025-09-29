const { Zona } = require("../models");

async function findAll() {
  const rows = await Zona.findAll();
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(id) {
  const row = await Zona.findByPk(id);
  return row ? row.get({ plain: true }) : null;
}

async function create(data) {
  const row = await Zona.create(data);
  const created = await findById(row.idZona);
  return created;
}

async function update(id, data) {
  const [updated] = await Zona.update(data, {
    where: { idZona: id }
  });
  if (!updated) return null;
  return await findById(id);
}

module.exports = {
  findAll,
  findById,
  create,
  update
};
