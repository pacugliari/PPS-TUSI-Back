// src/models/devolucion.js
const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Devolucion = sequelize.define('Devolucion', {
    idDevolucion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idPedido: { type: DataTypes.INTEGER, allowNull: false },
    idProducto: { type: DataTypes.INTEGER, allowNull: false },
    motivo: { 
      type: DataTypes.ENUM('producto_defectuoso','producto_incorrecto','producto_incompleto'),
      allowNull: false
    },
    comentario: { type: DataTypes.TEXT },
    fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    estado: { type: DataTypes.ENUM('revision','aprobado','rechazado'), defaultValue: 'revision' },
  }, { tableName: 'Devoluciones', timestamps: true });
  return Devolucion;
};
