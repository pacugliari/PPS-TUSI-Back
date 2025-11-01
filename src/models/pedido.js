const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Pedido = sequelize.define(
    "Pedido",
    {
      idPedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      estado: {
        type: DataTypes.ENUM(
          "pendiente",
          "entregado",
          "reservado",
          "pagado",
          "enviado",
          "cancelado",
          "devuelto"
        ),
        defaultValue: "pendiente",
      },

      /** Totales y desglose financiero */
      subtotal: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
      impuestos: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
      descuentoCupon: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
      descuentoBanco: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
      costoEnvio: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
      total: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },

      /** Datos de contexto */
      formaPago: {
        type: DataTypes.ENUM("efectivo", "electronico"),
        allowNull: false,
      },
      porcentajeCupon: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
      porcentajeBanco: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
    },
    {
      tableName: "Pedidos",
      timestamps: true,
    }
  );

  return Pedido;
};
