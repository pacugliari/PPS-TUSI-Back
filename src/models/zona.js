const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Zona = sequelize.define('Zona', {
    idZona: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    costoEnvio: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
  }, { tableName: 'Zonas', timestamps: true });
  return Zona;
};
