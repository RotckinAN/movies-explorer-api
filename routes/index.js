const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const { createUser, login } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { validateUserBody } = require('../middlewares/validateUserBody');
const { validateAuthentication } = require('../middlewares/validateAuthentication');
const { NotFound } = require('../errors/notFound');

router.post('/signup', validateAuthentication, createUser);
router.post('/signin', validateUserBody, login);
router.get('/signout', (req, res) => {
  res.clearCookie('jwt', {
    sameSite: 'None',
    secure: true,
  }).json({ message: 'Выход' });
});

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use('*', (req, res, next) => next(new NotFound('Произошла ошибка, передан некорректный путь')));

module.exports = router;
