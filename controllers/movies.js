const Movie = require('../models/movie');
const { InternalServerError } = require('../errors/internalServerError');
const { NotFound } = require('../errors/notFound');
const { Forbidden } = require('../errors/forbidden');
const { BadRequest } = require('../errors/badRequest');

const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({});
    return res.json(movies);
  } catch (err) {
    return next(new InternalServerError('Произошла ошибка загрузки фильмов'));
  }
};

const createMovie = async (req, res, next) => {
  try {
    const {
      country, director, duration, year, description, image,
      trailerLink, thumbnail, movieId, nameRU, nameEN,
    } = req.body;
    const ownerId = req.user._id;

    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner: ownerId,
      movieId,
      nameRU,
      nameEN,
    });

    return res.status(201).json(movie);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new BadRequest('Произошла ошибка, переданы некорректные данные'));
    }
    return next(err);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const userId = req.user._id;

    const movie = await Movie.findById({ movieId: movieId });

    if (movie === null) {
      throw new NotFound('Запрашиваемый фильм не найден');
    }
    if (movie.owner.valueOf() === userId) {
      await movie.remove();
    } else {
      throw new Forbidden('Произошла ошибка, вы не имеете права удалять фильм');
    }

    return res.json({ message: 'Фильм удален' });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequest('Произошла ошибка, переданы некорректные данные'));
    }
    return next(err);
  }
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
