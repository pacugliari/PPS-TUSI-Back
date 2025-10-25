const { SubCategoria } = require("../models");

async function findAll() {
  const rows = await SubCategoria.findAll({
    where: { activo: true },
    attributes: { exclude: ["activo"] },
  });
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(id) {
  const row = await SubCategoria.findByPk(id);
  return row ? row.get({ plain: true }) : null;
}

async function findOne(where) {
  const row = await SubCategoria.findOne({
    where: {
      ...where,
      activo: true,
    },
  });
  return row ? row.get({ plain: true }) : null;
}

async function create(data) {
  const row = await SubCategoria.create(data);
  return row.get({ plain: true });
}

async function update(id, data) {
  const [updated] = await SubCategoria.update(data, {
    where: { idSubCategoria: id },
  });
  if (!updated) return null;
  return await findById(id);
}

async function remove(id) {
  return await SubCategoria.destroy({ where: { idBanco: id } });
}

module.exports = {
  findAll,
  findById,
  findOne,
  create,
  update,
  remove,
};
