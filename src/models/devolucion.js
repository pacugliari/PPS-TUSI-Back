// src/models/devolucion.js
const { DataTypes } = require("sequelize");
const { ESTADOS_DEVOLUCION } = require("../constants/devolucion");

module.exports = (sequelize) => {
  const Devolucion = sequelize.define(
    "Devolucion",
    {
      idDevolucion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idPedido: { type: DataTypes.INTEGER, allowNull: false },
      idProducto: { type: DataTypes.INTEGER, allowNull: false },
      motivo: {
        type: DataTypes.ENUM(
          "producto_defectuoso",
          "producto_incorrecto",
          "producto_incompleto"
        ),
        allowNull: false,
      },
      comentario: { type: DataTypes.TEXT },
      fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      estado: {
        type: DataTypes.ENUM(...Object.values(ESTADOS_DEVOLUCION)),
        defaultValue: ESTADOS_DEVOLUCION.REVISION,
      },
      activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "Devoluciones", timestamps: true }
  );

  return Devolucion;
};
