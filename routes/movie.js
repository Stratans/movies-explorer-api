const router = require('express').Router();
const { validationCreateMovie, validationIdCheck } = require('../middlewares/validations');

const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movie');

router.get('/', getMovies);

router.post('/', validationCreateMovie, createMovie);

router.delete('/:_id', validationIdCheck, deleteMovie);

module.exports = router;
