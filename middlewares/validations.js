const { celebrate, Joi } = require('celebrate');
const { REG_URL } = require('../utils/constants');

const validationUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
});

const validationCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(3).max(30),
    director: Joi.string().required().min(3).max(30),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required().min(3).max(100),
    image: Joi.string().required().regex(REG_URL),
    trailerLink: Joi.string().required().regex(REG_URL),
    thumbnail: Joi.string().required().regex(REG_URL),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().min(3).max(100),
    nameEN: Joi.string().required().min(3).max(100),
  }),
});

const validationIdCheck = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  validationUpdateProfile,
  validationCreateMovie,
  validationIdCheck,
};
