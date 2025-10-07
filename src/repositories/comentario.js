const { Comentario } = require("../models");

async function findAll() {
  const rows = await Comentario.findAll();
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(id) {
  const row = await Comentario.findByPk(id);
  return row ? row.get({ plain: true }) : null;
}

async function create(data) {
  const row = await Comentario.create(data);
  const created = await findById(row.idComentario);
  return created;
}

async function update(id, data) {
  const [updated] = await Comentario.update(data, {
    where: { idComentario: id }
  });
  if (!updated) return null;
  return await findById(id);
}

async function remove(id) {
  return await Comentario.destroy({ where: { idComentario: id } });
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
