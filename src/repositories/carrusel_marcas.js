const { CarruselMarcas } = require("../models");

async function findAll() {
  const rows = await CarruselMarcas.findAll({
    where: { activo: true },
    attributes: { exclude: ["activo"] },
    order: [["orden", "ASC"]],
  });
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(id) {
  const row = await CarruselMarcas.findByPk(id);
  return row ? row.get({ plain: true }) : null;
}

async function findOne(where) {
  const row = await CarruselMarcas.findOne({
    where: { ...where, activo: true },
  });
  return row ? row.get({ plain: true }) : null;
}

async function create(data) {
  const row = await CarruselMarcas.create(data);
  return row.get({ plain: true });
}

async function update(id, data) {
  const [updated] = await CarruselMarcas.update(data, {
    where: { idCarruselMarcas: id },
  });
  if (!updated) return null;
  return await findById(id);
}

async function remove(id) {
  return await CarruselMarcas.destroy({
    where: { idCarruselMarcas: id },
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
