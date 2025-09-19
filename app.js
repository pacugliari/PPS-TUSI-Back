// server.js
const express = require("express");
const dotenv = require("dotenv");
const { initDb } = require("./src/config/sequelize");
require("./src/models");
const { ROLES } = require("./src/constants/roles");
const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

// Rutas
const authRoutes = require("./src/routes/auth");
const productsRoutes = require("./src/routes/producto");

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
app.use("/api/auth", authRoutes);
app.use(
  "/api/products",
  auth,
  requireAnyRole(ROLES.ADMIN, ROLES.OPERARIO),
  productsRoutes
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
