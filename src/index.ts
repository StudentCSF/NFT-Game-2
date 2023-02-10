import Moralis from 'moralis';
import express from 'express';
import cors from 'cors';
import { parseDashboard } from './parseDashboard';
import { parseServer } from './parseServer';
import { errorHandler } from './middlewares/errorHandler';
import config from './config';
import { apiRouter } from './apiRouter';

const app = express();

Moralis.start({
  apiKey: config.MORALIS_API_KEY,
});

app.get('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});


app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(express.json({ limit: '50mb' }));

app.use(cors());

app.use(`/${config.SERVER_ENDPOINT}`, parseServer);
app.use('/dashboard', parseDashboard);
app.use('/api', apiRouter);
app.use(errorHandler);

app.use(express.static('public'));

app.listen(config.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`${config.APP_NAME} is running on port ${config.PORT}`);
});