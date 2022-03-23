import express from 'express';
import quote from './modules/quote';
import cors from 'cors';
import config from './config';

const app = express();

app.use(cors());

const mountMiddleware = (req, res, next) => {
  req.config = config;
  next();
}

app.use('/api/quote', mountMiddleware, quote);

const { port } = config;

app.listen(port, () => {

  console.log(`Server is running on ${port} port`);

});