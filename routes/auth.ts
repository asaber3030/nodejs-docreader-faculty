import { Router } from 'express';

import AuthController from '../controllers/AuthController';

const authRouter = Router();

// authRouter.post('/create-admin', authController.createAdmin);
authRouter.post('/signup', AuthController.signup);
authRouter.get(
  '/login/callback',
  AuthController.finishOAuth2Flow,
  AuthController.createUser,
);
// authRouter.get('/is-authenticated', authController.isAuthenticated);
// authRouter.get('/user', checkIsAuthenticated, authController.getUserData);

export default authRouter;
