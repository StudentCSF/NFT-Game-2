import Moralis from 'moralis';
import express from 'express';
import cors from 'cors';
import { parseDashboard } from './parseDashboard';
import { parseServer } from './parseServer';
import { errorHandler } from './middlewares/errorHandler';
import config from './config';
import { apiRouter } from './apiRouter';

const app = express()
const PORT = 4000

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})

app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})

app.get('/about', (req, res) => {
  res.send('This is my about route..... ')
})

// Export the Express API
module.exports = app