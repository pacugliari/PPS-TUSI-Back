class ResponseBuilder {
  static success(
    payload = null,
    message = "Operación exitosa",
    statusCode = 200,
    errors = undefined
  ) {
    return {
      statusCode,
      success: true,
      message,
      payload,
      errors: errors ?? undefined,
    };
  }

  static error(message = "Ocurrió un error", errors = [], statusCode = 400) {
    return {
      statusCode,
      success: false,
      message,
      payload: null,
      errors,
    };
  }
}

module.exports = ResponseBuilder;
