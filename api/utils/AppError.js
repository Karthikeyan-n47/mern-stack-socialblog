class AppError extends Error {
  constructor(message, statusCode) {
    this.message = message;
    this.statusCode = statusCode;
    this.status = `${statusCode}` >= 500 ? "error" : "fail";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
