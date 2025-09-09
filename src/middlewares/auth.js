const ResponseBuilder = require("../utils/api-response");
const HttpError = require("../utils/http-error");

const auth = async (req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    const { verifyToken } = await import("../utils/jwt.mjs");
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json(
          ResponseBuilder.error(
            "No se ha proporcionado un token de autenticación",
            [{ token: "El token es requerido" }],
            401
          )
        );
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifyToken(token);
    req.payload = payload;
    if (!payload)
      return res
        .status(401)
        .json(
          ResponseBuilder.error(
            "Token inválido",
            [{ token: "El token es inválido o no autorizado" }],
            401
          )
        );

    req.user = payload;
    next();
  } else {
    if (req.session.user) return next();
    throw new HttpError(401, "No autenticado", "auth/login").setErrors([
      { session: "No hay una sesión activa o ha expirado" },
    ]);
  }
};

module.exports = auth;
