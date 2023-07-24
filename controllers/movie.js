const movie = require('../models/movies');
const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');
const ForbiddenError = require('../errors/forbiddenError');

const {
  CREATED,
  STATUS_ОК,
} = require('../utils/constants');

// СОЗДАНИЕ ФИЛЬМА
module.exports.createMovie = ((req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  return movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movieData) => movieData.populate('owner')
      .then(() => { res.status(CREATED).send(movieData); }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Приехали! Некорректные данные!'));
      } else {
        next(err);
      }
    });
});

// ПОЛУЧЕНИЕ ВСЕХ ФИЛЬМОВ
module.exports.getMovies = (req, res, next) => {
  const { _id } = req.user;
  movie.find({ owner: _id })
    .populate(['owner', '_id'])
    .then((movieData) => res.status(STATUS_ОК).send(movieData))
    .catch(next);
};

// УДАЛЕНИЕ ФИЛЬМА ПО АЙДИ
module.exports.deleteMovie = ((req, res, next) => {
  const userId = req.user._id;
  const removeMovie = () => {
    movie.findByIdAndRemove(req.params._id)
      .then((movieData) => {
        res.send({ data: movieData });
      })
      .catch(next);
  };
  movie.findById(req.params._id)
    .then((movieData) => {
      if (!movieData) {
        throw new NotFoundError('Приехали! Пользователь не найден!');
      }
      if (movieData.owner.toString() !== userId) {
        throw new ForbiddenError('Приехали! Не имеете права удалять чужой фильм!');
      }
      return removeMovie();
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Приехали! Некорректное айди!'));
      } else next(err);
    });
});
