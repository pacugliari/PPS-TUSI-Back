const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Caracteristica = sequelize.define('Caracteristica', {
    idCaracteristica: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    descripcion: { type: DataTypes.STRING(200), allowNull: false },
  }, { tableName: 'Caracteristicas', timestamps: true });
  return Caracteristica;
};
