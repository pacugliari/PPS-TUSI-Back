// src/models/envio.js
const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const Envio = sequelize.define(
    "Envio",
    {
      idEnvio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idPedido: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      idDireccion: { type: DataTypes.INTEGER, allowNull: false },
      precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    { tableName: "Envios", timestamps: true }
  );
  return Envio;
};
