const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

(async () => {
  try {
    const res = await cloudinary.api.ping();
    console.log("[CLOUDINARY] ✅ Conexión exitosa:", res);
  } catch (err) {
    console.error("[CLOUDINARY] ⚠️ Error al conectar:", err.message || err);
  }
})();

module.exports = cloudinary;
