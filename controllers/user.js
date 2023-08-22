const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');
const ConflictError = require('../errors/conflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

const { CREATED } = require('../utils/constants');

// ДОБАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ
module.exports.createUser = ((req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => user.create({
      name, email, password: hash,
    })
      .then((userData) => {
        const { _id } = userData;
        res.status(CREATED).send({
          data: {
            _id, email, name,
          },
        });
      }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Приехали! Некорректные данные!'));
      } else if (err.code === 11000) {
        next(new ConflictError('Приехали! Пользователь уже существует!'));
      } else {
        next(err);
      }
    });
});

// ОБНОВЛЕНИЕ ПРОФИЛЯ
module.exports.updateProfile = ((req, res, next) => {
  const { email, name } = req.body;
  const userId = req.user._id;
  user.findByIdAndUpdate(userId, { email, name }, { runValidators: true, new: true })
    .then((userData) => {
      if (!userData) {
        throw new NotFoundError('Приехали! Пользователь не найден!');
      }
      res.send({ email, name });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Приехали! Некорректные данные!'));
      } else next(err);
    });
});

// ЛОГИН
module.exports.login = ((req, res, next) => {
  const { email, password } = req.body;
  return user.findUserByCredentials(email, password)
    .then((userData) => {
      if (userData) {
        const token = jwt.sign({ _id: userData._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
        res.send({ token });
      }
    })
    .catch(next);
});

// ПОЛУЧЕНИЕ ИНФОРМАЦИИ О ПОЛЬЗОВАТЕЛЕ
module.exports.getUserInfo = ((req, res, next) => {
  const userId = req.user._id;
  user.findById(userId)
    .then((userData) => {
      if (!userData) {
        throw new NotFoundError('Приехали! Пользователь не найден!');
      }
      const { email, name } = userData;
      res.send({ email, name, userId });
    })
    .catch(next);
});
