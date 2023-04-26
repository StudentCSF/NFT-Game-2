import express from 'express';
import { verify, request, options } from './authController';

export const authRouter = express.Router();

authRouter.route('/request-message').post(request);
authRouter.route('/request-message').options(request)
authRouter.route('/sign-message').post(verify);