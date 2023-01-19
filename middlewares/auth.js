const jwt = require('jsonwebtoken');
const { Unauthorized } = require('../errors/unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    if (!req.cookies) {
      return next(new Unauthorized('Необходима авторизация'));
    }

    try {
      payload = jwt.verify(
        token,
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      );
    } catch (err) {
      return next(new Unauthorized('Необходима авторизация'));
    }

    req.user = payload;
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  auth,
};
