// src/models/pedido.js
const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Pedido = sequelize.define('Pedido', {
    idPedido: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idUsuario: { type: DataTypes.INTEGER, allowNull: false },
    fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    estado: { 
      type: DataTypes.ENUM('pendiente','entregado','reservado','pagado','enviado','cancelado','devuelto'),
      defaultValue: 'pendiente'
    },
    impuestos: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    subtotal: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    total: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    formaPago: { type: DataTypes.ENUM('efectivo','electronico'), allowNull: false },
  }, { tableName: 'Pedidos', timestamps: true });
  return Pedido;
};
