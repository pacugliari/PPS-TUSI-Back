const cors = require("cors");
const HttpError = require("../utils/http-error");
const dotenv = require("dotenv");
const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",").map(o => o.trim()) || [];

const corsOptions = {
  origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(
        new HttpError(
          401,
          "No se ha proporcionado un origen permitido",
          "auth/login"
        ).setErrors([{ origin: "El origen no está autorizado por CORS" }])
      );
    }
  },
  credentials: true,
};

module.exports = cors(corsOptions);
