// server.js
const express = require("express");
const dotenv = require("dotenv");
const { initDb } = require("./src/config/sequelize");
require("./src/models");
const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

const authRoutes = require("./src/routes/auth");
const productosRoutes = require("./src/routes/producto");
const homeRoutes = require("./src/routes/home");
const accountRoutes = require("./src/routes/account");
const cartRoutes = require("./src/routes/cart");
const checkoutRoutes = require("./src/routes/checkout");

// Middlewares
const errorHandler = require("./src/middlewares/http-error");
const corsMiddleware = require("./src/middlewares/cors");
const auth = require("./src/middlewares/auth");
const app = express();

// Middlewares base para API JSON
app.use(express.json());
app.use(corsMiddleware);

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/shop", productosRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/account", auth, accountRoutes);
app.use("/api/cart", auth, cartRoutes);
app.use("/api/checkout", auth, checkoutRoutes);

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
