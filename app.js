// server.js
const express = require("express");
const dotenv = require("dotenv");
const { initDb } = require("./src/config/sequelize");
require("./src/models");
const { ROLES } = require("./src/constants/roles");
const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

const authRoutes = require("./src/routes/auth");
const comentariosRoutes = require("./src/routes/comentario");
const categoriasRoutes = require("./src/routes/categoria");
const productsRoutes = require("./src/routes/producto");
const bancosRoutes = require("./src/routes/banco");
const caracteristicasRoutes = require("./src/routes/caracteristica");
const subcategoriaRoutes = require("./src/routes/subcategoria");
const marcaRoutes = require("./src/routes/marca");
const stockRoutes = require("./src/routes/stock");
const usuarioRoutes = require("./src/routes/usuario");
const perfilRoutes = require("./src/routes/perfil");
const direccionRoutes = require("./src/routes/direccion");
const tarjetaRoutes = require("./src/routes/tarjeta");
const cuponRoutes = require("./src/routes/cupon");
const promocionBancariaRoutes = require("./src/routes/promocionbancaria");
const propiedadRoutes = require("./src/routes/propiedad");
const rolRoutes = require("./src/routes/rol");
const zonaRoutes = require("./src/routes/zona");
const detallepedidoRoutes = require("./src/routes/detallepedido");
const homeRoutes = require("./src/routes/home");
const devolucionRoutes = require("./src/routes/devolucion");
const envioRoutes = require("./src/routes/envio");
const ordenCompraRoutes = require("./src/routes/ordencompra");
const itemOrdenCompraRoutes = require("./src/routes/itemordencompra");
const pedidoRoutes = require("./src/routes/pedido");

// Middlewares
const errorHandler = require("./src/middlewares/http-error");
const corsMiddleware = require("./src/middlewares/cors");
const auth = require("./src/middlewares/auth");
const {
  preAuthorize,
  requireAnyRole,
  requireRole,
} = require("./src/middlewares/preAuthorize");

const app = express();

// Middlewares base para API JSON
app.use(express.json());
app.use(corsMiddleware);

// Rutas
app.use(
  "/api/subcategorias",
  auth,
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO),
  subcategoriaRoutes
);
app.use(
  "/api/marcas",
  auth,
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO),
  marcaRoutes
);
app.use(
  "/api/stocks",
  auth,
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO),
  stockRoutes
);
app.use(
  "/api/usuarios",
  auth,
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO),
  usuarioRoutes
);
app.use(
  "/api/perfiles",
  auth,
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO),
  perfilRoutes
);
app.use(
  "/api/direcciones",
  auth,
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO),
  direccionRoutes
);
app.use(
  "/api/tarjetas",
  auth,
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO),
  tarjetaRoutes
);
app.use(
  "/api/cupones",
  auth,
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO),
  cuponRoutes
);
app.use(
  "/api/promocionesbancarias",
  auth,
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO),
  promocionBancariaRoutes
);
app.use(
  "/api/propiedades",
  auth,
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO),
  propiedadRoutes
);
app.use(
  "/api/roles",
  auth,
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO),
  rolRoutes
);
app.use(
  "/api/zonas",
  auth,
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO),
  zonaRoutes
);
app.use(
  "/api/comentarios",
  auth,
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO),
  comentariosRoutes
);
app.use(
  "/api/categorias",
  auth,
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO),
  categoriasRoutes
);
app.use(
  "/api/caracteristicas",
  auth,
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO),
  caracteristicasRoutes
);
app.use("/api/auth", authRoutes);
app.use(
  "/api/products",
  productsRoutes
);
app.use(
  "/api/bancos",
  auth,
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO),
  bancosRoutes
);
app.use(
  "/api/detallepedidos",
  auth,
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO),
  detallepedidoRoutes
);
app.use("/api/home", homeRoutes);
app.use(
  "/api/devoluciones",
  auth,
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO),
  devolucionRoutes
);
app.use(
  "/api/envios",
  auth,
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO),
  envioRoutes
);
app.use(
  "/api/ordenescompra",
  auth,
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO),
  ordenCompraRoutes
);
app.use(
  "/api/itemsordencompra",
  auth,
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO),
  itemOrdenCompraRoutes
);
app.use(
  "/api/pedidos",
  auth,
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO),
  pedidoRoutes
);

// Handler de errores (al final)
app.use(errorHandler);

(async () => {
  try {
    // En desarrollo podés dejar 'alter'. En prod usualmente false (migraciones).
    await initDb({ sync: "alter" });
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar servidor:", error);
    process.exit(1);
  }
})();
