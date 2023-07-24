const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./user');
const movieRouter = require('./movie');
const { createUser, login } = require('../controllers/user');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/notFoundError');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.use(auth);

router.use('/users', userRouter);

router.use('/movies', movieRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Приехали! Страница не найдена!'));
});

module.exports = router;
