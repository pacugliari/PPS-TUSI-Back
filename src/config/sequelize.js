const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log(`✅ Conexión a Sequelize exitosa: ${process.env.DB_HOST}`);
    // 🔹 Sincronizar todos los modelos registrados
    return sequelize.sync({ alter: true }); // o { force: true } en dev
  })
  .then(() => {
    console.log("✅ Tablas sincronizadas correctamente");
  })
  .catch((err) => console.error("❌ Error conectando a Sequelize:", err));

module.exports = sequelize;
