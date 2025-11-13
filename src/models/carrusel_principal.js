const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CarruselPrincipal = sequelize.define(
    "CarruselPrincipal",
    {
      idCarruselPrincipal: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      titulo: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },

      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      imagenUrl: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      link: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      orden: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },

      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "CarruselPrincipal",
      timestamps: true,
    }
  );

  return CarruselPrincipal;
};
