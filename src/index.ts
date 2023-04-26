import Moralis from 'moralis';
import express from 'express';
import cors from 'cors';
import { parseDashboard } from './parseDashboard';
import { parseServer } from './parseServer';
import { errorHandler } from './middlewares/errorHandler';
import config from './config';
import { apiRouter } from './apiRouter';
// import { allowCors } from './api/options'

const app = express();

Moralis.start({
  apiKey: config.MORALIS_API_KEY,
});

var corsOptions = {
  origin: config.CLIENT_URL,
  optionsSuccessStatus: 200
};

app.use(cors());

app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(express.json({ limit: '50mb' }));

app.use(`/${config.SERVER_ENDPOINT}`, parseServer);
app.use('/dashboard', parseDashboard);
app.use('/ap', apiRouter);
app.use(errorHandler);

app.use(express.static('public'));

app.listen(config.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`${config.APP_NAME} is running on port ${config.PORT}`);
});

// module.exports = app;