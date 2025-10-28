class HttpError extends Error {
  constructor(
    statusCode,
    message,
    errors = []
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }

  setErrors(errors) {
    this.errors = errors;
    return this;
  }
}

module.exports = HttpError;
