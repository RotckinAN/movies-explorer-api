const bcrypt = require('bcryptjs');
const Users = require('../models/user');
const { BadRequest } = require('../errors/badRequest');
const { Conflict } = require('../errors/conflict');
const { Unauthorized } = require('../errors/unauthorized');
const { generateToken } = require('../helpers/token');
const { NotFound } = require('../errors/notFound');

const createUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const hash = await bcrypt.hash(password, 10);
    const user = await Users.create({
      email, password: hash, name,
    });

    const payload = { _id: user._id };
    const token = generateToken(payload);
    return res.status(201).cookie('jwt', token, {
      maxAge: 3600000 * 24,
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    }).json({
      _id: user._id,
      email: user.email,
      name: user.name,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequest('Произошла ошибка, переданы некорректные данные'));
    }
    if (err.message.indexOf('duplicate key error') !== -1) {
      return next(new Conflict('Произошла ошибка, пользователь с таким email уже существует, введите новый email'));
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email }).select('+password');

    if (!user) {
      throw new Unauthorized('Неправильные почта или пароль');
    }

    const result = await bcrypt.compare(password, user.password);

    if (result) {
      const payload = { _id: user._id };
      const token = generateToken(payload);

      return res.cookie('jwt', token, {
        maxAge: 3600000 * 24,
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      }).json({ message: 'Вход выполнен успешно' });
    }

    throw new Unauthorized('Неправильные почта или пароль');
  } catch (err) {
    return next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await Users.findById(userId);

    if (user === null) {
      throw new NotFound('Запрашиваемый пользователь не найден');
    }

    return res.json(user);
  } catch (err) {
    return next(err);
  }
};

const patchProfileInfo = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;

    const newUserInfo = await Users.findByIdAndUpdate(userId, { name, email }, {
      new: true,
      runValidators: true,
    });

    if (newUserInfo === null) {
      throw new NotFound('Запрашиваемый пользователь не найден');
    }

    return res.json({
      name: newUserInfo.name,
      email: newUserInfo.email,
    });
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new BadRequest('Произошла ошибка, переданы некорректные данные'));
    }
    if (err.message.indexOf('duplicate key error') !== -1) {
      return next(new Conflict('Произошла ошибка, пользователь с таким email уже существует, введите новый email'));
    }
    return next(err);
  }
};

module.exports = {
  createUser,
  login,
  getUser,
  patchProfileInfo,
};
