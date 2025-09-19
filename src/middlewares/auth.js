const ResponseBuilder = require("../utils/api-response");

module.exports = async function auth(req, res, next) {
  try {
    const { verifyToken } = await import("../utils/jwt.mjs");
    const hdr = req.headers.authorization;
    if (!hdr?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json(
          ResponseBuilder.error("Falta token", [{ token: "Requerido" }], 401)
        );
    }
    const token = hdr.split(" ")[1];
    const payload = await verifyToken(token).catch(() => null);
    if (!payload) {
      return res
        .status(401)
        .json(
          ResponseBuilder.error("Token inválido", [{ token: "Inválido" }], 401)
        );
    }
    // listo: sólo del token
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      permisos: payload.permisos || [],
    };
    next();
  } catch (e) {
    next(e);
  }
};
