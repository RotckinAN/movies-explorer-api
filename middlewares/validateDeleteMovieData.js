const { celebrate, Joi } = require('celebrate');

const validateDeleteMovieData = celebrate({
  params: Joi.object().keys({
    movieId: Joi.number().integer().required(),
  }),
});

module.exports = {
  validateDeleteMovieData,
};
