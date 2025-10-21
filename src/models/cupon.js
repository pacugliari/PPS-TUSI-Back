const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Cupon = sequelize.define("Cupon", {
    idCupon: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idUsuario: { type: DataTypes.INTEGER, allowNull: false },
    porcentaje: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0, max: 100 },
    },
    codigo: { type: DataTypes.STRING(50), allowNull: false },
    fechaDesde: { type: DataTypes.DATEONLY, allowNull: false },
    fechaHasta: { type: DataTypes.DATEONLY, allowNull: false },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  }, {
    tableName: "Cupones",
    timestamps: true,
    indexes: [
      { unique: true, fields: ["codigo", "activo"] },
    ],
  });

  return Cupon;
};
