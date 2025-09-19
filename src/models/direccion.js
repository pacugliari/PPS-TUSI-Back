// src/models/direccion.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Direccion = sequelize.define('Direccion', {
    idDireccion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idZona: { type: DataTypes.INTEGER, allowNull: false },
    idUsuario: { type: DataTypes.INTEGER, allowNull: false },
    direccion: { type: DataTypes.STRING(200), allowNull: false },
    localidad: { type: DataTypes.STRING(120), allowNull: false },
    cp: { type: DataTypes.STRING(12), allowNull: false },
  }, { tableName: 'Direcciones', timestamps: true });

  return Direccion;
};
