// src/models/comentario.js
const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Comentario = sequelize.define('Comentario', {
    idComentario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idProducto: { type: DataTypes.INTEGER, allowNull: false },
    idUsuario: { type: DataTypes.INTEGER, allowNull: false },
    puntuacion: { type: DataTypes.INTEGER, allowNull: false, validate: { min:1, max:5 } },
    comentario: { type: DataTypes.TEXT, allowNull: false },
    fechaCreacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    fechaModificacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, { tableName: 'Comentarios', timestamps: true });
  return Comentario;
};
