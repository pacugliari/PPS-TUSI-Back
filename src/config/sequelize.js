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
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  }
);

/**
 * Inicializa la BD.
 * @param {{ sync?: false | 'alter' | 'force' }} options
 *   - sync: false (no sync), 'alter' (ajusta), 'force' (drop + create)
 */
async function initDb({ sync = false } = {}) {
  await sequelize.authenticate();
  console.log("✅ Conexión a la base de datos establecida");

  if (sync === "force") {
    await sequelize.sync({ force: true });
    console.log("⚠️  sync { force: true } ejecutado (tablas recreadas)");
  } else if (sync === "alter") {
    await sequelize.sync({ alter: true });
    console.log("✅ sync { alter: true } ejecutado (tablas actualizadas)");
  } else {
    console.log("ℹ️  sync omitido (sync = false)");
  }
}

module.exports = { sequelize, initDb };
