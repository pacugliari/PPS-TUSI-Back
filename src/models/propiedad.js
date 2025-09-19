// src/models/propiedad.js  (tabla puente Producto-Caracteristica con 'valor')
const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Propiedad = sequelize.define('Propiedad', {
    idPropiedad: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idProducto: { type: DataTypes.INTEGER, allowNull: false },
    idCaracteristica: { type: DataTypes.INTEGER, allowNull: false },
    valor: { type: DataTypes.STRING(255), allowNull: false },
  }, { tableName: 'Propiedades', timestamps: true });
  return Propiedad;
};
