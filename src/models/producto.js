// src/models/producto.js
const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Producto = sequelize.define('Producto', {
    idProducto: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idCategoria: { type: DataTypes.INTEGER, allowNull: false },
    idSubCategoria: { type: DataTypes.INTEGER, allowNull: false },
    idMarca: { type: DataTypes.INTEGER, allowNull: false },
    nombre: { type: DataTypes.STRING(180), allowNull: false },
    precio: { type: DataTypes.DECIMAL(12,2), allowNull: false },
    descripcion: { type: DataTypes.TEXT },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, // campo rápido
    fechaCreacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    fechaModificacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    fotos: { type: DataTypes.JSON, defaultValue: [] },
  }, { tableName: 'Productos', timestamps: true });
  return Producto;
};
