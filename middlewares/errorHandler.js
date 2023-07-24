const { SERVER_ERROR } = require('../utils/constants');

const errorHadler = ((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === SERVER_ERROR ? 'Ошибка сервера' : err.message;
  res.status(statusCode).send({ message });
  next();
});

module.exports = { errorHadler };
