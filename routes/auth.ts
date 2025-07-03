import { Router } from 'express';

import AuthController from '../controllers/AuthController';

const authRouter = Router();

// authRouter.post('/create-admin', authController.createAdmin);
authRouter.post('/login', AuthController.continueWithGoogle);
authRouter.get(
  '/login/callback',
  AuthController.extractOAuth2Tokens,
  AuthController.extractAndVerifyGoogleJWT,
  AuthController.createUser,
);

// authRouter.get('/is-authenticated', authController.isAuthenticated);
// authRouter.get('/user', checkIsAuthenticated, authController.getUserData);

export default authRouter;
