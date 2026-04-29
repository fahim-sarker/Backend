// middleware/asyncHandler.js

// Wraps async route handlers to catch errors automatically
// Instead of writing try/catch in every controller, we wrap it here
// Any thrown error gets passed to our global errorHandler middleware

const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Without asyncHandler — every controller needs this boilerplate:
// try { ... } catch(error) { next(error) }

// With asyncHandler — controllers stay clean:
// const getProducts = asyncHandler(async (req, res) => { ... })

module.exports = asyncHandler;
