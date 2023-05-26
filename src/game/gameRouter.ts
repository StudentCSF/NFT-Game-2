import express from 'express';
import { reward, getPlayerData, setPlayerHighScore } from './gameController'

export const gameRouter = express.Router();

gameRouter.route('/reward').post(reward);
gameRouter.route('/playerUrl').post(getPlayerData);
gameRouter.route('/score').post(setPlayerHighScore);