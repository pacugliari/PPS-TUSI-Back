const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Banco = sequelize.define('Banco', {
    idBanco: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  }, { tableName: 'Bancos', timestamps: true });
  return Banco;
};
