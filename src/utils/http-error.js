class HttpError extends Error {
  constructor(
    statusCode,
    message,
    urlNavigation = "movies/index",
    title = "Error",
    errors = []
  ) {
    super(message);
    this.statusCode = statusCode;
    this.title = title;
    this.urlNavigation = urlNavigation;
    this.errors = errors;
  }

  setErrors(errors) {
    this.errors = errors;
    return this;
  }
}

module.exports = HttpError;
