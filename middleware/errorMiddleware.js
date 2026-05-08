
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;


  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found — invalid ID format";
  }

  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists — please use a different value`;
  }


  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map(val => val.message)
      .join(", ");
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token — please log in again";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired — please log in again";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
