// src/models/ordencompra.js
const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const OrdenCompra = sequelize.define('OrdenCompra', {
    idOrdenCompra: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    estado: { type: DataTypes.ENUM('entregado','pendiente'), defaultValue: 'pendiente' },
    impuestos: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    subtotal: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    total: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
  }, { tableName: 'OrdenesCompra', timestamps: true });
  return OrdenCompra;
};
