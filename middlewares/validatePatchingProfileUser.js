const { celebrate, Joi } = require('celebrate');

const validatePatchingProfileUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email().required(),
  }),
});

module.exports = {
  validatePatchingProfileUser,
};
