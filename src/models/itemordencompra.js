// src/models/itemordencompra.js
const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const ItemOrdenCompra = sequelize.define(
    "ItemOrdenCompra",
    {
      idItemOrdenCompra: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idOrdenCompra: { type: DataTypes.INTEGER, allowNull: false },
      idProducto: { type: DataTypes.INTEGER, allowNull: false },
      cantidad: { type: DataTypes.INTEGER, allowNull: false },
      cantidadRecibida: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    { tableName: "ItemsOrdenCompra", timestamps: true }
  );
  return ItemOrdenCompra;
};
