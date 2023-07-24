require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const router = require('./routes/index');
const { DB_URL_DEV } = require('./utils/constants');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHadler } = require('./middlewares/errorHandler');
const { expressLimit } = require('./middlewares/expressLimit');

const { PORT = 3000, DB_URL, NODE_ENV } = process.env;
const app = express();
mongoose
  .connect(NODE_ENV === 'production' ? DB_URL : DB_URL_DEV)
  .then(() => console.log('Соединение с базой данных установлено'))
  .catch(() => console.log('Ошибка соединения с базой данных'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger); // подключаем  логгер запросов
app.use(helmet());

app.use(expressLimit);

app.use('/', router);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use(errorHadler);

app.listen(PORT, () => {
  console.log('Ура! Сервер запущен!');
});
