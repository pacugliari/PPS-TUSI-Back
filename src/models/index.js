// src/models/index.js
const {sequelize} = require('../config/sequelize');

// Instanciar modelos
const Rol            = require('./rol')(sequelize);
const Banco          = require('./banco')(sequelize);
const Zona           = require('./zona')(sequelize);
const Categoria      = require('./categoria')(sequelize);
const SubCategoria   = require('./subcategoria')(sequelize);
const Marca          = require('./marca')(sequelize);
const Caracteristica = require('./caracteristica')(sequelize);
const Usuario        = require('./usuario')(sequelize);

// Asociaciones
SubCategoria.belongsTo(Categoria, {
  foreignKey: { name: 'idCategoria', allowNull: false },
  as: 'categoria'
});
Categoria.hasMany(SubCategoria, { foreignKey: 'idCategoria', as: 'subcategorias' });

Usuario.belongsTo(Rol, { foreignKey: { name: 'idRol', allowNull: false }, as: 'rol' });
Rol.hasMany(Usuario, { foreignKey: 'idRol', as: 'usuarios' });

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
};
