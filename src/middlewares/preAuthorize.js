// src/middlewares/preAuthorize.js
const ResponseBuilder = require("../utils/api-response");

function forbid(res, msg = "No autorizado", details = []) {
  return res
    .status(403)
    .json(ResponseBuilder.error(msg, details.length ? details : [{ auth: "No autorizado" }], 403));
}

function parseArgs(listStr) {
  // "'ADMIN','OPERARIO'" -> ["ADMIN","OPERARIO"]
  return listStr
    .split(",")
    .map(s => s.trim().replace(/^['"]|['"]$/g, ""))
    .filter(Boolean);
}

function preAuthorize(expression) {
  const reHasRole          = /^hasRole\((.+)\)$/i;
  const reHasAnyRole       = /^hasAnyRole\((.+)\)$/i;
  const reHasPermission    = /^hasPermission\((.+)\)$/i;
  const reHasAnyPermission = /^hasAnyPermission\((.+)\)$/i;

  return (req, res, next) => {
    if (!req.user) return forbid(res, "No autenticado");

    // Normalizar (por si en el token viene objeto)
    const role =
      typeof req.user.role === "string" ? req.user.role :
      (req.user.role && req.user.role.tipo) ? req.user.role.tipo :
      null;

    const perms = Array.isArray(req.user.permisos)
      ? req.user.permisos
      : (Array.isArray(req.user.role?.permisos) ? req.user.role.permisos : []);

    const expr = String(expression).trim();

    // hasRole('administrador')
    if (reHasRole.test(expr)) {
      const [wanted] = parseArgs(expr.match(reHasRole)[1]);
      return role === wanted ? next() : forbid(res, "Rol insuficiente", [{ role, required: wanted }]);
    }

    // hasAnyRole('administrador','operario')
    if (reHasAnyRole.test(expr)) {
      const wanted = parseArgs(expr.match(reHasAnyRole)[1]);
      return wanted.includes(role)
        ? next()
        : forbid(res, "Rol insuficiente", [{ role, requiredAny: wanted }]);
    }

    // hasPermission('stock:update')
    if (reHasPermission.test(expr)) {
      const [p] = parseArgs(expr.match(reHasPermission)[1]);
      return perms.includes(p)
        ? next()
        : forbid(res, "Permisos insuficientes", [{ required: p }]);
    }

    // hasAnyPermission('pedidos:read','stock:update')
    if (reHasAnyPermission.test(expr)) {
      const wanted = parseArgs(expr.match(reHasAnyPermission)[1]);
      return wanted.some(p => perms.includes(p))
        ? next()
        : forbid(res, "Permisos insuficientes", [{ requiredAny: wanted }]);
    }

    return forbid(res, "Expresión de autorización no soportada", [{ expression }]);
  };
}

// Helpers directos (más cortos de usar)
const requireRole = (role) => preAuthorize(`hasRole('${role}')`);
const requireAnyRole = (...roles) => preAuthorize(`hasAnyRole(${roles.map(r => `'${r}'`).join(",")})`);
const requirePermission = (perm) => preAuthorize(`hasPermission('${perm}')`);
const requireAnyPermission = (...perms) => preAuthorize(`hasAnyPermission(${perms.map(p => `'${p}'`).join(",")})`);

module.exports = { preAuthorize, requireRole, requireAnyRole, requirePermission, requireAnyPermission };
