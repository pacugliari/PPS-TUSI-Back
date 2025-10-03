// src/models/stock.js
const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Stock = sequelize.define('Stock', {
    idStock: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idProducto: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    stockMinimo: { type: DataTypes.INTEGER, defaultValue: 0 },
    stockMaximo: { type: DataTypes.INTEGER, defaultValue: 0 },
    stockActual: { type: DataTypes.INTEGER, defaultValue: 0 },
    reservado: { type: DataTypes.INTEGER, defaultValue: 0 },
    comprometido: { type: DataTypes.INTEGER, defaultValue: 0 },
    disponibilidad: { type: DataTypes.INTEGER, defaultValue: 0 },
    estado: { type: DataTypes.ENUM('disponible','agotado'), defaultValue: 'disponible' },
  }, { tableName: 'Stocks', timestamps: true });
  return Stock;
};
