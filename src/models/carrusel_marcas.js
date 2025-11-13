const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CarruselMarcas = sequelize.define(
    "CarruselMarcas",
    {
      idCarruselMarcas: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      logoUrl: {
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
      tableName: "CarruselMarcas",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["nombre"],
        },
      ],
    }
  );

  return CarruselMarcas;
};
