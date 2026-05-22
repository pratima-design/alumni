exports.notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
};

exports.multerErrorHandler = (err, _req, res, next) => {
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400);
      return next(new Error("File size exceeds 10MB limit"));
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      res.status(400);
      return next(new Error("Too many files uploaded"));
    }
    res.status(400);
    return next(new Error(`Upload error: ${err.message}`));
  }
  next(err);
};

exports.errorHandler = (err, _req, res, _next) => {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({
    message: err.message || "Server error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
