const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SubCategoria = sequelize.define('SubCategoria', {
    idSubCategoria: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idCategoria: { type: DataTypes.INTEGER, allowNull: false },
    nombre: { type: DataTypes.STRING(120), allowNull: false },
    descripcion: { type: DataTypes.TEXT },
  }, { tableName: 'SubCategorias', timestamps: true });

  return SubCategoria;
};
