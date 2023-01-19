const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).json({ message });
  next();
};

module.exports = {
  errorHandler,
};
