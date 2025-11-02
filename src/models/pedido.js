const { DataTypes } = require("sequelize");
const { ESTADOS_PEDIDOS, FORMAS_PAGO } = require("../constants/pedidos");

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
        type: DataTypes.ENUM(...Object.values(ESTADOS_PEDIDOS)),
        allowNull: false,
        defaultValue: ESTADOS_PEDIDOS.PENDIENTE,
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
        type: DataTypes.ENUM(...Object.values(FORMAS_PAGO)),
        allowNull: false,
      },
      porcentajeCupon: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
      porcentajeBanco: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
      activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      tableName: "Pedidos",
      timestamps: true,
    }
  );

  return Pedido;
};
