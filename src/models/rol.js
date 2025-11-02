const { DataTypes } = require("sequelize");
const { ROLES } = require("../constants/roles");

module.exports = (sequelize) => {
  const Rol = sequelize.define(
    "Rol",
    {
      idRol: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: DataTypes.STRING(60), allowNull: false },
      tipo: {
        type: DataTypes.ENUM(...Object.values(ROLES)),
        allowNull: false,
      },
      permisos: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    },
    { tableName: "Roles", timestamps: true }
  );
  return Rol;
};
