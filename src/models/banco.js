const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Banco = sequelize.define(
    "Banco",
    {
      idBanco: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: { type: DataTypes.STRING(100), allowNull: false },
      activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      tableName: "Bancos",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["nombre", "activo"],
        },
      ],
    }
  );

  return Banco;
};
