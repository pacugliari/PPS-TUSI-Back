// src/models/cupon.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Cupon = sequelize.define('Cupon', {
    idCupon: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idUsuario: { type: DataTypes.INTEGER, allowNull: false },
    monto: { type: DataTypes.DECIMAL(12,2), allowNull: false },
    codigo: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    fechaDesde: { type: DataTypes.DATEONLY, allowNull: false },
    fechaHasta: { type: DataTypes.DATEONLY, allowNull: false },
  }, { tableName: 'Cupones', timestamps: true });

  return Cupon;
};
