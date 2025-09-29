const { Tarjeta, Usuario, Banco } = require("../models");

async function findAll() {
  const rows = await Tarjeta.findAll({
    include: [
      { model: Usuario, as: "usuario", attributes: ['idUsuario', 'email'] },
      { model: Banco, as: "banco", attributes: ['idBanco', 'nombre'] }
    ]
  });
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(id) {
  const row = await Tarjeta.findByPk(id, {
    include: [
      { model: Usuario, as: "usuario", attributes: ['idUsuario', 'email'] },
      { model: Banco, as: "banco", attributes: ['idBanco', 'nombre'] }
    ]
  });
  return row ? row.get({ plain: true }) : null;
}

async function findOne(where) {
  const row = await Tarjeta.findOne({ where });
  return row ? row.get({ plain: true }) : null;
}

async function create(data) {
  const row = await Tarjeta.create(data);
  const created = await findById(row.idTarjeta);
  return created;
}

async function update(id, data) {
  const [updated] = await Tarjeta.update(data, {
    where: { idTarjeta: id }
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
