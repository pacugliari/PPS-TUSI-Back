// src/models/perfil.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Perfil = sequelize.define('Perfil', {
    idPerfil: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idUsuario: { type: DataTypes.INTEGER, allowNull: false, unique: true }, // 1:1 con Usuario
    nombre: { type: DataTypes.STRING(120), allowNull: false },
    dni: { type: DataTypes.BIGINT, allowNull: false },
    telefono: { type: DataTypes.STRING(40) },
  }, { tableName: 'Perfiles', timestamps: true });

  return Perfil;
};
