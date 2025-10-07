const { Categoria } = require("../models");

async function findAll() {
  const rows = await Categoria.findAll();
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(id) {
  const row = await Categoria.findByPk(id);
  return row ? row.get({ plain: true }) : null;
}

async function create(data) {
  const row = await Categoria.create(data);
  const created = await findById(row.idCategoria);
  return created;
}

async function update(id, data) {
  const [updated] = await Categoria.update(data, {
    where: { idCategoria: id }
  });
  if (!updated) return null;
  return await findById(id);
}

async function remove(id) {
  return await Categoria.destroy({ where: { idCategoria: id } });
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
