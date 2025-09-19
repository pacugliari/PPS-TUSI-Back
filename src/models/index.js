// src/models/index.js
const { sequelize } = require("../config/sequelize");

// Instanciar modelos base existentes
const Rol = require("./rol")(sequelize);
const Banco = require("./banco")(sequelize);
const Zona = require("./zona")(sequelize);
const Categoria = require("./categoria")(sequelize);
const SubCategoria = require("./subcategoria")(sequelize);
const Marca = require("./marca")(sequelize);
const Caracteristica = require("./caracteristica")(sequelize);
const Usuario = require("./usuario")(sequelize);

// Nuevos modelos
const Cupon = require("./cupon")(sequelize);
const Perfil = require("./perfil")(sequelize);
const Tarjeta = require("./tarjeta")(sequelize);
const Direccion = require("./direccion")(sequelize);
const PromocionBancaria = require("./promocionbancaria")(sequelize);

// Asociaciones existentes
SubCategoria.belongsTo(Categoria, {
  foreignKey: { name: "idCategoria", allowNull: false },
  as: "categoria",
});
Categoria.hasMany(SubCategoria, {
  foreignKey: "idCategoria",
  as: "subcategorias",
});

Usuario.belongsTo(Rol, {
  foreignKey: { name: "idRol", allowNull: false },
  as: "rol",
});
Rol.hasMany(Usuario, { foreignKey: "idRol", as: "usuarios" });

// === Nuevas asociaciones ===

// Perfil 1:1 Usuario
Perfil.belongsTo(Usuario, {
  foreignKey: { name: "idUsuario", allowNull: false },
  as: "usuario",
});
Usuario.hasOne(Perfil, { foreignKey: "idUsuario", as: "perfil" });

// Tarjeta N:1 Usuario y N:1 Banco
Tarjeta.belongsTo(Usuario, {
  foreignKey: { name: "idUsuario", allowNull: false },
  as: "usuario",
});
Usuario.hasMany(Tarjeta, { foreignKey: "idUsuario", as: "tarjetas" });

Tarjeta.belongsTo(Banco, {
  foreignKey: { name: "idBanco", allowNull: false },
  as: "banco",
});
Banco.hasMany(Tarjeta, { foreignKey: "idBanco", as: "tarjetas" });

// Direccion N:1 Usuario y N:1 Zona
Direccion.belongsTo(Usuario, {
  foreignKey: { name: "idUsuario", allowNull: false },
  as: "usuario",
});
Usuario.hasMany(Direccion, { foreignKey: "idUsuario", as: "direcciones" });

Direccion.belongsTo(Zona, {
  foreignKey: { name: "idZona", allowNull: false },
  as: "zona",
});
Zona.hasMany(Direccion, { foreignKey: "idZona", as: "direcciones" });

// Cupon N:1 Usuario
Cupon.belongsTo(Usuario, {
  foreignKey: { name: "idUsuario", allowNull: false },
  as: "usuario",
});
Usuario.hasMany(Cupon, { foreignKey: "idUsuario", as: "cupones" });

// PromocionBancaria N:1 Banco
PromocionBancaria.belongsTo(Banco, {
  foreignKey: { name: "idBanco", allowNull: false },
  as: "banco",
});
Banco.hasMany(PromocionBancaria, { foreignKey: "idBanco", as: "promociones" });

module.exports = {
  sequelize,
  Rol,
  Banco,
  Zona,
  Categoria,
  SubCategoria,
  Marca,
  Caracteristica,
  Usuario,
  // nuevos
  Cupon,
  Perfil,
  Tarjeta,
  Direccion,
  PromocionBancaria,
};
