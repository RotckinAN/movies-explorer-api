const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validateCreateMovieData } = require('../middlewares/validateCreateMovieData');
const { validateDeleteMovieData } = require('../middlewares/validateDeleteMovieData');

router.get('/', getMovies);
router.post('/', validateCreateMovieData, createMovie);
router.delete('/:movieId', validateDeleteMovieData, deleteMovie);

module.exports = router;
