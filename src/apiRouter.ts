import express from 'express';
import { authRouter } from './auth/authRouter';
import { gameRouter } from './game/gameRouter';

export const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/game', gameRouter);