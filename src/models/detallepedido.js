// src/models/detallepedido.js
const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const DetallePedido = sequelize.define('DetallePedido', {
    idDetallePedido: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idPedido: { type: DataTypes.INTEGER, allowNull: false },
    idProducto: { type: DataTypes.INTEGER, allowNull: false },
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
  }, { tableName: 'DetallesPedido', timestamps: true });
  return DetallePedido;
};
