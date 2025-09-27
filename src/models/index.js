// src/models/index.js
const { sequelize } = require("../config/sequelize");

/* =========================
 *  Instancia de modelos
 * ========================= */
const Rol = require("./rol")(sequelize);
const Banco = require("./banco")(sequelize);
const Zona = require("./zona")(sequelize);
const Categoria = require("./categoria")(sequelize);
const SubCategoria = require("./subcategoria")(sequelize);
const Marca = require("./marca")(sequelize);
const Caracteristica = require("./caracteristica")(sequelize);
const Usuario = require("./usuario")(sequelize);

const Perfil = require("./perfil")(sequelize);
const Direccion = require("./direccion")(sequelize);
const Tarjeta = require("./tarjeta")(sequelize);
const Cupon = require("./cupon")(sequelize);
const PromocionBancaria = require("./promocionbancaria")(sequelize);

const Producto = require("./producto")(sequelize);
const Stock = require("./stock")(sequelize);
const Propiedad = require("./propiedad")(sequelize);
const Comentario = require("./comentario")(sequelize);

const Pedido = require("./pedido")(sequelize);
const DetallePedido = require("./detallepedido")(sequelize);
const Envio = require("./envio")(sequelize);

const OrdenCompra = require("./ordencompra")(sequelize);
const ItemOrdenCompra = require("./itemordencompra")(sequelize);

const Devolucion = require("./devolucion")(sequelize);

/* =========================
 *  Asociaciones base
 * ========================= */
// SubCategoría ↔ Categoría
SubCategoria.belongsTo(Categoria, {
  foreignKey: { name: "idCategoria", allowNull: false },
  as: "categoria",
});
Categoria.hasMany(SubCategoria, {
  foreignKey: "idCategoria",
  as: "subcategorias",
});

// Usuario ↔ Rol
Usuario.belongsTo(Rol, {
  foreignKey: { name: "idRol", allowNull: false },
  as: "rol",
});
Rol.hasMany(Usuario, { foreignKey: "idRol", as: "usuarios" });

/* =========================
 *  Usuario / Perfil / Dirección / Tarjeta / Cupón / Promo
 * ========================= */
// Perfil (1:1) Usuario
Perfil.belongsTo(Usuario, {
  foreignKey: { name: "idUsuario", allowNull: false },
  as: "usuario",
});
Usuario.hasOne(Perfil, { foreignKey: "idUsuario", as: "perfil" });

// Dirección (N:1) Usuario y (N:1) Zona
Direccion.belongsTo(Usuario, {
  foreignKey: { name: "idUsuario", allowNull: false },
  as: "usuario",
});
Usuario.hasMany(Direccion, { foreignKey: "idUsuario", as: "direcciones" });

Direccion.belongsTo(Zona, {
  foreignKey: { name: "idZona", allowNull: false },
  as: "zona",
});
Zona.hasMany(Direccion, { foreignKey: "idZona", as: "direcciones" });

// Tarjeta (N:1) Usuario y (N:1) Banco
Tarjeta.belongsTo(Usuario, {
  foreignKey: { name: "idUsuario", allowNull: false },
  as: "usuario",
});
Usuario.hasMany(Tarjeta, { foreignKey: "idUsuario", as: "tarjetas" });

Tarjeta.belongsTo(Banco, {
  foreignKey: { name: "idBanco", allowNull: false },
  as: "banco",
});
Banco.hasMany(Tarjeta, { foreignKey: "idBanco", as: "tarjetas" });

// Cupón (N:1) Usuario
Cupon.belongsTo(Usuario, {
  foreignKey: { name: "idUsuario", allowNull: false },
  as: "usuario",
});
Usuario.hasMany(Cupon, { foreignKey: "idUsuario", as: "cupones" });

// Promoción Bancaria (N:1) Banco
PromocionBancaria.belongsTo(Banco, {
  foreignKey: { name: "idBanco", allowNull: false },
  as: "banco",
});
Banco.hasMany(PromocionBancaria, {
  foreignKey: "idBanco",
  as: "promociones",
});

/* =========================
 *  Catálogo: Producto / Stock / Propiedades / Comentarios
 * ========================= */
// Producto ↔ Categoría / SubCategoría / Marca
Producto.belongsTo(Categoria, {
  foreignKey: { name: "idCategoria", allowNull: false },
  as: "categoria",
});
Producto.belongsTo(SubCategoria, {
  foreignKey: { name: "idSubCategoria", allowNull: false },
  as: "subcategoria",
});
Producto.belongsTo(Marca, {
  foreignKey: { name: "idMarca", allowNull: false },
  as: "marca",
});
Categoria.hasMany(Producto, { foreignKey: "idCategoria", as: "productos" });
SubCategoria.hasMany(Producto, {
  foreignKey: "idSubCategoria",
  as: "productos",
});
Marca.hasMany(Producto, { foreignKey: "idMarca", as: "productos" });

// Stock (1:1) Producto
Stock.belongsTo(Producto, {
  foreignKey: { name: "idProducto", allowNull: false },
  as: "producto",
});
Producto.hasOne(Stock, { foreignKey: "idProducto", as: "stockDetallado" });

// Propiedad (N:1) Producto y (N:1) Característica
Propiedad.belongsTo(Producto, {
  foreignKey: { name: "idProducto", allowNull: false },
  as: "producto",
});
Propiedad.belongsTo(Caracteristica, {
  foreignKey: { name: "idCaracteristica", allowNull: false },
  as: "caracteristica",
});
Producto.hasMany(Propiedad, { foreignKey: "idProducto", as: "propiedades" });
Caracteristica.hasMany(Propiedad, {
  foreignKey: "idCaracteristica",
  as: "propiedades",
});

// Comentario (N:1) Producto y (N:1) Usuario
Comentario.belongsTo(Producto, {
  foreignKey: { name: "idProducto", allowNull: false },
  as: "producto",
});
Comentario.belongsTo(Usuario, {
  foreignKey: { name: "idUsuario", allowNull: false },
  as: "usuario",
});
Producto.hasMany(Comentario, { foreignKey: "idProducto", as: "comentarios" });
Usuario.hasMany(Comentario, { foreignKey: "idUsuario", as: "comentarios" });

/* =========================
 *  Ventas: Pedido / Detalle / Envío
 * ========================= */
// Pedido (N:1) Usuario
Pedido.belongsTo(Usuario, {
  foreignKey: { name: "idUsuario", allowNull: false },
  as: "usuario",
});
Usuario.hasMany(Pedido, { foreignKey: "idUsuario", as: "pedidos" });

// DetallePedido (N:1) Pedido y (N:1) Producto
DetallePedido.belongsTo(Pedido, {
  foreignKey: { name: "idPedido", allowNull: false },
  as: "pedido",
});
DetallePedido.belongsTo(Producto, {
  foreignKey: { name: "idProducto", allowNull: false },
  as: "producto",
});

// Envío (1:1) Pedido y (N:1) Dirección
Envio.belongsTo(Pedido, {
  foreignKey: { name: "idPedido", allowNull: false },
  as: "pedido",
});
Pedido.hasOne(Envio, { foreignKey: "idPedido", as: "envio" });

Envio.belongsTo(Direccion, {
  foreignKey: { name: "idDireccion", allowNull: false },
  as: "direccion",
});
Direccion.hasMany(Envio, { foreignKey: "idDireccion", as: "envios" });

/* =========================
 *  Compras: OrdenCompra / Ítems
 * ========================= */
ItemOrdenCompra.belongsTo(OrdenCompra, {
  foreignKey: { name: "idOrdenCompra", allowNull: false },
  as: "orden",
});
ItemOrdenCompra.belongsTo(Producto, {
  foreignKey: { name: "idProducto", allowNull: false },
  as: "producto",
});
OrdenCompra.hasMany(ItemOrdenCompra, {
  foreignKey: "idOrdenCompra",
  as: "items",
});
Producto.hasMany(ItemOrdenCompra, {
  foreignKey: "idProducto",
  as: "itemsOrdenCompra",
});

/* =========================
 *  Devoluciones
 * ========================= */
Devolucion.belongsTo(Pedido, {
  foreignKey: { name: "idPedido", allowNull: false },
  as: "pedido",
});
Devolucion.belongsTo(Producto, {
  foreignKey: { name: "idProducto", allowNull: false },
  as: "producto",
});
Pedido.hasMany(Devolucion, { foreignKey: "idPedido", as: "devoluciones" });
Producto.hasMany(Devolucion, { foreignKey: "idProducto", as: "devoluciones" });

/* =========================
 *  Export
 * ========================= */
module.exports = {
  sequelize,
  // Base
  Rol,
  Banco,
  Zona,
  Categoria,
  SubCategoria,
  Marca,
  Caracteristica,
  Usuario,
  // Usuario +
  Perfil,
  Direccion,
  Tarjeta,
  Cupon,
  PromocionBancaria,
  // Catálogo
  Producto,
  Stock,
  Propiedad,
  Comentario,
  // Ventas
  Pedido,
  DetallePedido,
  Envio,
  // Compras
  OrdenCompra,
  ItemOrdenCompra,
  // Post-venta
  Devolucion,
};
