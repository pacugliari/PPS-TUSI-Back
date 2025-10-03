const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Marca = sequelize.define('Marca', {
    idMarca: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    descripcion: { type: DataTypes.TEXT },
  }, { tableName: 'Marcas', timestamps: true });
  return Marca;
};
