// src/models/detallepedido.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const DetallePedido = sequelize.define(
    "DetallePedido",
    {
      idDetallePedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idPedido: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idProducto: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      precio: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      iva: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 21.0,
      },
      subtotal: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
    },
    {
      tableName: "DetallesPedido",
      timestamps: true,
    }
  );

  return DetallePedido;
};
