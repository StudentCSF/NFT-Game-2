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

// var corsOptions = {
//   origin: config.CLIENT_URL,
//   optionsSuccessStatus: 200,
//   methods: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
//   allowedHeaders: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-UserSession'
// };

app.options("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-UserSession');
  res.sendStatus(200);
});

// app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})

app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(express.json({ limit: '50mb' }));

app.use(`/${config.SERVER_ENDPOINT}`, parseServer);
app.use('/dashboard', parseDashboard);
app.use('/api', apiRouter);
app.use(errorHandler);

app.use(express.static('public'));

app.listen(config.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`${config.APP_NAME} is running on port ${config.PORT}`);
});

module.exports = app;