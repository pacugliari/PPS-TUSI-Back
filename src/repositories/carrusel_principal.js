const { CarruselPrincipal } = require("../models");

async function findAll() {
  const rows = await CarruselPrincipal.findAll({
    where: { activo: true },
    attributes: { exclude: ["activo"] },
    order: [["orden", "ASC"]],
  });

  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(id) {
  const row = await CarruselPrincipal.findByPk(id);
  return row ? row.get({ plain: true }) : null;
}

async function findOne(where) {
  const row = await CarruselPrincipal.findOne({
    where: { ...where, activo: true },
  });
  return row ? row.get({ plain: true }) : null;
}

async function create(data) {
  const row = await CarruselPrincipal.create(data);
  return row.get({ plain: true });
}

async function update(id, data) {
  const [updated] = await CarruselPrincipal.update(data, {
    where: { idCarruselPrincipal: id },
  });

  if (!updated) return null;
  return await findById(id);
}

async function remove(id) {
  return await CarruselPrincipal.destroy({
    where: { idCarruselPrincipal: id },
  });
}

module.exports = {
  findAll,
  findById,
  findOne,
  create,
  update,
  remove,
};
