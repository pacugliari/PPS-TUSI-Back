// src/models/ordencompra.js
const { DataTypes } = require("sequelize");
const { ESTADOS_ORDEN_COMPRA } = require("../constants/ordencompra");
module.exports = (sequelize) => {
  const OrdenCompra = sequelize.define(
    "OrdenCompra",
    {
      idOrdenCompra: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      estado: {
        type: DataTypes.ENUM(
          ESTADOS_ORDEN_COMPRA.ENTREGADO,
          ESTADOS_ORDEN_COMPRA.PENDIENTE
        ),
        defaultValue: ESTADOS_ORDEN_COMPRA.PENDIENTE,
      },
      impuestos: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
      subtotal: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
      total: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    },
    { tableName: "OrdenesCompra", timestamps: true }
  );
  return OrdenCompra;
};
