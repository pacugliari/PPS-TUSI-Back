// src/models/direccion.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Direccion = sequelize.define('Direccion', {
    idDireccion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idZona: { type: DataTypes.INTEGER, allowNull: false },
    idUsuario: { type: DataTypes.INTEGER, allowNull: false },
    direccion: { type: DataTypes.STRING(200), allowNull: false },
    cp: { type: DataTypes.STRING(12), allowNull: false },
    alias: { type: DataTypes.STRING(50), allowNull: true },
    adicionales: { type: DataTypes.STRING(200), allowNull: true },
    principal: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  }, { tableName: 'Direcciones', timestamps: true });

  return Direccion;
};
