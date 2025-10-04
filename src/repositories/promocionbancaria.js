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

async function create(data) {
  const row = await PromocionBancaria.create(data);
  const created = await findById(row.idPromocionBancaria);
  return created;
}

async function update(id, data) {
  const [updated] = await PromocionBancaria.update(data, {
    where: { idPromocionBancaria: id }
  });
  if (!updated) return null;
  return await findById(id);
}

async function remove(id) {
  return await PromocionBancaria.destroy({ where: { idPromocionBancaria: id } });
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
