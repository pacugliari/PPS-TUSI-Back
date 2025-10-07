const { Direccion, Usuario, Zona } = require("../models");

async function findAll() {
  const rows = await Direccion.findAll({
    include: [
      { model: Usuario, as: "usuario", attributes: ['idUsuario', 'email'] },
      { model: Zona, as: "zona", attributes: ['idZona', 'nombre'] }
    ]
  });
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(id) {
  const row = await Direccion.findByPk(id, {
    include: [
      { model: Usuario, as: "usuario", attributes: ['idUsuario', 'email'] },
      { model: Zona, as: "zona", attributes: ['idZona', 'nombre'] }
    ]
  });
  return row ? row.get({ plain: true }) : null;
}

async function create(data) {
  const row = await Direccion.create(data);
  const created = await findById(row.idDireccion);
  return created;
}

async function update(id, data) {
  const [updated] = await Direccion.update(data, {
    where: { idDireccion: id }
  });
  if (!updated) return null;
  return await findById(id);
}

async function remove(id) {
  return await Direccion.destroy({ where: { idDireccion: id } });
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
