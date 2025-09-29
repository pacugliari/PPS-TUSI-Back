const { Cupon, Usuario } = require("../models");

async function findAll() {
  const rows = await Cupon.findAll({
    include: [
      { model: Usuario, as: "usuario", attributes: ['idUsuario', 'email'] }
    ]
  });
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(id) {
  const row = await Cupon.findByPk(id, {
    include: [
      { model: Usuario, as: "usuario", attributes: ['idUsuario', 'email'] }
    ]
  });
  return row ? row.get({ plain: true }) : null;
}

async function findOne(where) {
  const row = await Cupon.findOne({ where });
  return row ? row.get({ plain: true }) : null;
}

async function create(data) {
  const row = await Cupon.create(data);
  return row.get({ plain: true });
}

async function update(id, data) {
  const [updated] = await Cupon.update(data, {
    where: { idCupon: id }
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
