// src/models/promocionbancaria.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PromocionBancaria = sequelize.define('PromocionBancaria', {
    idPromocionBancaria: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idBanco: { type: DataTypes.INTEGER, allowNull: false },
    nombre: { type: DataTypes.STRING(150), allowNull: false },
    fechaDesde: { type: DataTypes.DATEONLY, allowNull: false },
    fechaHasta: { type: DataTypes.DATEONLY, allowNull: false },
    // Array de días válidos: ['lunes','martes','miercoles','jueves','viernes','sabado','domingo']
    dias: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  }, { tableName: 'PromocionesBancarias', timestamps: true });

  return PromocionBancaria;
};
