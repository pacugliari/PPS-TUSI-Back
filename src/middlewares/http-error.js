const ResponseBuilder = require("../utils/api-response");

const errorHandler = async (err, req, res, next) => {
  const statusCode = err.statusCode ?? 500;
  const errors = err.errors ?? [];
  const message =
    err.message ?? "Se ha generado un error inesperado en el servidor.";

  return res
    .status(statusCode)
    .json(ResponseBuilder.error(message, errors, statusCode));
};

module.exports = errorHandler;
