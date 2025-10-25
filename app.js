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
const productosRoutes = require("./src/routes/producto");
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
const accountRoutes = require("./src/routes/account");
const cartRoutes = require("./src/routes/cart");

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
  "/api/stocks",
  auth,
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO),
  stockRoutes
);

app.use(
  "/api/propiedades",
  auth,
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO),
  propiedadRoutes
);

app.use("/api/auth", authRoutes);
app.use("/api/productos", productosRoutes);

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
app.use("/api/account", auth, accountRoutes);
app.use("/api/cart", auth, cartRoutes);
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
