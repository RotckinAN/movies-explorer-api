require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const router = require('./routes/index');
const { errorHandler } = require('./helpers/errorHandler');
const { limiter } = require('./middlewares/rateLimit');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { allowedCorsMiddleware } = require('./middlewares/allowedCors');

const { PORT = 3001, NODE_ENV, MONGODB_ADDRESS } = process.env;
const mongoDBAddress = NODE_ENV === 'production' ? MONGODB_ADDRESS : 'mongodb://127.0.0.1:27017/bitfilmsdb';
const app = express();

app.use(cors(allowedCorsMiddleware));
app.use(requestLogger);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(limiter);
app.use(helmet());

app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect(mongoDBAddress, {
  useNewUrlParser: true,
}, () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});
