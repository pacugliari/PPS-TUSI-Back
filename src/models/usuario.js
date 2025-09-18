const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Usuario = sequelize.define(
    "Usuario",
    {
      idUsuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idRol: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Roles", key: "idRol" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      compraOnline: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true, notEmpty: true },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "Usuarios",
      timestamps: true,
    }
  );

  return Usuario;
};
