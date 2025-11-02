// src/models/tarjeta.js
const { DataTypes } = require("sequelize");
const { TARJETAS } = require("../constants/tarjetas");
module.exports = (sequelize) => {
  const Tarjeta = sequelize.define(
    "Tarjeta",
    {
      idTarjeta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idBanco: { type: DataTypes.INTEGER, allowNull: false },
      idUsuario: { type: DataTypes.INTEGER, allowNull: false },
      tipo: {
        type: DataTypes.ENUM(...Object.values(TARJETAS)),
        allowNull: false,
      },
      codigo: { type: DataTypes.STRING(6), allowNull: false }, // ej: CVV
      numero: { type: DataTypes.STRING(19), allowNull: false }, // 16 + espacios
      activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "Tarjetas", timestamps: true }
  );

  return Tarjeta;
};
