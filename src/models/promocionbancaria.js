const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PromocionBancaria = sequelize.define(
    "PromocionBancaria",
    {
      idPromocionBancaria: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idBanco: { type: DataTypes.INTEGER, allowNull: false },
      nombre: { type: DataTypes.STRING(150), allowNull: false },
      fechaDesde: { type: DataTypes.DATEONLY, allowNull: false },
      fechaHasta: { type: DataTypes.DATEONLY, allowNull: false },
      activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      dias: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
      porcentaje: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 100 },
      },
    },
    { tableName: "PromocionesBancarias", timestamps: true }
  );

  return PromocionBancaria;
};
