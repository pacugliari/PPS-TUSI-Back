const { Usuario, Perfil, Rol } = require("../models");

async function findAll() {
  const rows = await Usuario.findAll({
    attributes: ["idUsuario", "email"],
    include: [
      {
        model: Perfil,
        as: "perfil",
        attributes: ["nombre", "dni", "telefono"],
        required: false,
      },
      {
        model: Rol,
        as: "rol",
        attributes: ["tipo"],
        required: false,
      },
    ],
    order: [["idUsuario", "ASC"]],
  });
  return { rows: rows.map((r) => r.get({ plain: true })) };
}

async function findById(id) {
  const row = await Usuario.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  return row ? row.get({ plain: true }) : null;
}

module.exports = { findAll, findById };
