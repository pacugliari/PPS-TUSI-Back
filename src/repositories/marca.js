const { Marca } = require("../models");

async function findAll() {
  const rows = await Marca.findAll();
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(id) {
  const row = await Marca.findByPk(id);
  return row ? row.get({ plain: true }) : null;
}

async function findOne(where) {
  const row = await Marca.findOne({ where });
  return row ? row.get({ plain: true }) : null;
}

async function create(data) {
  const row = await Marca.create(data);
  const created = await findById(row.idMarca);
  return created;
}

async function update(id, data) {
  const [updated] = await Marca.update(data, {
    where: { idMarca: id }
  });
  if (!updated) return null;
  return await findById(id);
}

async function remove(id) {
  return await Marca.destroy({ where: { idMarca: id } });
}

module.exports = {
  findAll,
  findById,
  findOne,
  create,
  update,
  remove
};
