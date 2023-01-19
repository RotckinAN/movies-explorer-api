const allowedCors = [
  'https://manofilmai.nomoredomains.rocks/', // !
  'http://manofilmai.nomoredomains.rocks/', // !
  'localhost:3000',
];

const allowedCorsMiddleware = {
  origin: allowedCors,
  optionsSuccessStatus: 200,
  credentials: true,
};

module.exports = {
  allowedCorsMiddleware,
};
