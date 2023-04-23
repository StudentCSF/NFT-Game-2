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

var corsOptions = {
  origin: config.CLIENT_URL,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// app.options("/*", function(req, res, next){
//   res.header('Access-Control-Allow-Origin', 'https://nft-game-2-client.vercel.app');
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
//   res.send(200);
// });

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   if (req.method == "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
//     return res.status(200).json({});
//   }

//   next();
// });



// module.exports = (req, res) => {
//   //set header first to allow request or origin domain (value can be different)
//   res.setHeader('Access-Control-Allow-Origin', 'https://nft-game-2-client.vercel.app');
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, OPTIONS, DELETE');

// //---- other code

// //Preflight CORS handler
//   if(req.method === 'OPTIONS') {
//       return res.status(200).json(({
//           body: "OK"
//       }))
//   }

// }

// app.options('*', cors())
// app.use('/*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*123");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next();
// });

app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(express.json({ limit: '50mb' }));

app.use(`/${config.SERVER_ENDPOINT}`, parseServer);
app.use('/dashboard', parseDashboard);
app.use('/api', cors(corsOptions), apiRouter);
app.use(errorHandler);

app.use(express.static('public'));

app.listen(config.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`${config.APP_NAME} is running on port ${config.PORT}`);
});

// module.exports = app;