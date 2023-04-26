import express from 'express';
import { verify, request } from './authController';

export const authRouter = express.Router();

authRouter.route('/request-messag').post(request);
authRouter.route('/sign-message').post(verify);