const allowedCors = [
  'https://manovieta.nomoredomains.club', // !
  'http://manovieta.nomoredomains.club', // !
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
