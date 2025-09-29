const { Perfil, Usuario } = require("../models");

async function findAll() {
  const rows = await Perfil.findAll({
    include: [
      { model: Usuario, as: "usuario", attributes: ['idUsuario', 'email'] }
    ]
  });
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(id) {
  const row = await Perfil.findByPk(id, {
    include: [
      { model: Usuario, as: "usuario", attributes: ['idUsuario', 'email'] }
    ]
  });
  return row ? row.get({ plain: true }) : null;
}

async function findOne(where) {
  const row = await Perfil.findOne({ where });
  return row ? row.get({ plain: true }) : null;
}

async function create(data) {
  const row = await Perfil.create(data);
  return row.get({ plain: true });
}

async function update(id, data) {
  const [updated] = await Perfil.update(data, {
    where: { idPerfil: id }
  });
  if (!updated) return null;
  return await findById(id);
}

async function remove(id) {
  return await Perfil.destroy({ where: { idPerfil: id } });
}

module.exports = {
  findAll,
  findById,
  findOne,
  create,
  update,
  remove,
};
