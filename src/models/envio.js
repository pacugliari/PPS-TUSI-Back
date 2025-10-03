// src/models/envio.js
const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Envio = sequelize.define('Envio', {
    idEnvio: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idPedido: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    idDireccion: { type: DataTypes.INTEGER, allowNull: false },
  }, { tableName: 'Envios', timestamps: true });
  return Envio;
};
